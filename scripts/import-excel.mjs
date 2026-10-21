// Importe le classeur data/source/compas-referentiel.xlsx dans le référentiel
// (docs/specs/05-import-excel.md) :
// - génère data/relations.json, data/grilles/<theme>.json, data/scores/<courant>.json ;
// - régénère l'en-tête des fiches src/content/courants/<id>.md sans toucher à leur corps.
// Rien n'est écrit si une erreur est détectée.
//
// Usage : npm run import:excel [-- --dry-run] [-- --fichier <classeur.xlsx>]
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'astro/zod';
import ExcelJS from 'exceljs';
import {
  courantSchema,
  critereSchema,
  famillesFichierSchema,
  grilleSchema,
  modulesFichierSchema,
  relationSchema,
  scoresSchema,
  valeurScoreSchema,
} from '../src/lib/schemas.ts';
import { CORPS_INITIAL, decouperFiche, enTeteFiche } from './lib/fiches.mjs';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const simulation = args.includes('--dry-run');
const indexFichier = args.indexOf('--fichier');
const cheminClasseur =
  indexFichier >= 0 ? args[indexFichier + 1] : join(racine, 'data', 'source', 'compas-referentiel.xlsx');

const A_COMPLETER = '[À COMPLÉTER]';
const NOTE_GENEREE =
  'Fichier généré par npm run import:excel depuis data/source/compas-referentiel.xlsx. Ne pas modifier à la main.';

z.config(z.locales.fr());

/** Chemin relatif au dépôt s'il s'y trouve, absolu sinon. */
const affichage = (chemin) => {
  const r = relative(racine, chemin);
  return r.startsWith('..') ? chemin : r.replaceAll('\\', '/');
};

const erreurs = [];
const avertissements = [];
const erreur = (onglet, ligne, colonne, message) =>
  erreurs.push(`${onglet}, ligne ${ligne}${colonne ? `, colonne ${colonne}` : ''} : ${message}`);
const avertir = (message) => avertissements.push(message);

// ---------------------------------------------------------------------------
// Lecture des onglets

/** Valeur affichée d'une cellule : résultat des formules, texte des liens et du texte enrichi. */
function valeurCellule(cellule) {
  const v = cellule.value;
  if (v === null || v === undefined) return null;
  if (v instanceof Date) return v;
  if (typeof v === 'object') {
    if ('formula' in v || 'sharedFormula' in v) return v.result ?? null;
    if ('richText' in v) return v.richText.map((r) => r.text).join('');
    if ('text' in v) return typeof v.text === 'string' ? v.text : (v.hyperlink ?? null);
    if ('error' in v) return null;
  }
  if (typeof v === 'string') return v.trim() === '' ? null : v.trim();
  return v;
}

/**
 * Lit un onglet en tableau d'objets indexés par l'en-tête de la ligne 1.
 * Chaque objet porte `_ligne` (numéro de ligne Excel). Les lignes entièrement vides sont ignorées.
 */
function lireOnglet(classeur, nom, colonnesRequises, colonnesFacultatives = []) {
  const feuille = classeur.getWorksheet(nom);
  if (!feuille) {
    erreur(nom, 1, null, 'onglet absent du classeur');
    return [];
  }
  const colonnes = new Map();
  feuille.getRow(1).eachCell((cellule, numero) => {
    const entete = valeurCellule(cellule);
    if (typeof entete === 'string') colonnes.set(entete, numero);
  });
  for (const c of colonnesRequises) if (!colonnes.has(c)) erreur(nom, 1, c, 'colonne absente');
  const utiles = [...colonnesRequises, ...colonnesFacultatives].filter((c) => colonnes.has(c));
  const lignes = [];
  feuille.eachRow((ligne, numero) => {
    if (numero === 1) return;
    const objet = { _ligne: numero };
    for (const c of utiles) objet[c] = valeurCellule(ligne.getCell(colonnes.get(c)));
    if (utiles.some((c) => objet[c] !== null)) lignes.push(objet);
  });
  return lignes;
}

// ---------------------------------------------------------------------------
// Conversion des cellules

function texte(onglet, l, colonne) {
  const v = l[colonne] ?? null;
  if (v === null) return null;
  if (v instanceof Date) {
    erreur(onglet, l._ligne, colonne, 'une date Excel n’est pas attendue ici (saisir du texte)');
    return null;
  }
  return String(v).trim();
}

/** Valeurs multiples séparées par « ; ». */
function liste(onglet, l, colonne) {
  const t = texte(onglet, l, colonne);
  return t
    ? t
        .split(';')
        .map((x) => x.trim())
        .filter((x) => x !== '')
    : [];
}

/** Nombre, en acceptant la virgule décimale saisie comme texte (« 6,5 »). */
function nombre(onglet, l, colonne) {
  const v = l[colonne] ?? null;
  if (v === null) return null;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.').trim());
  if (!Number.isFinite(n)) {
    erreur(onglet, l._ligne, colonne, `« ${v} » n’est pas un nombre`);
    return null;
  }
  return n;
}

function ouiNon(onglet, l, colonne) {
  const v = l[colonne] ?? null;
  if (v === null) return null;
  if (v === true || v === false) return v;
  const t = String(v).trim().toLowerCase();
  if (t === 'oui') return true;
  if (t === 'non') return false;
  erreur(onglet, l._ligne, colonne, `« ${v} » : « oui » ou « non » attendu`);
  return null;
}

/** « Titre (Auteurs, année) » ; l'année et les parenthèses sont facultatives. */
function texteReference(brut) {
  const m = brut.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
  if (!m) return { titre: brut, auteurs: '', annee: null };
  const parties = m[2].split(',').map((x) => x.trim());
  const dernier = parties.at(-1) ?? '';
  if (/^-?\d{1,4}$/.test(dernier)) {
    return { titre: m[1], auteurs: parties.slice(0, -1).join(', '), annee: Number(dernier) };
  }
  return { titre: m[1], auteurs: m[2].trim(), annee: null };
}

/** Rapporte les erreurs Zod sur la ligne Excel, en traduisant les champs en colonnes. */
function rapporterZod(onglet, l, resultat, colonnes = {}) {
  if (resultat.success) return resultat.data;
  for (const issue of resultat.error.issues) {
    const champ = String(issue.path[0] ?? '');
    const valeur = issue.path.reduce((o, k) => (o == null ? o : o[k]), resultat.entree);
    const precision = valeur !== undefined && typeof valeur !== 'object' ? ` (« ${valeur} »)` : '';
    erreur(onglet, l._ligne, colonnes[champ] ?? champ, `${issue.message}${precision}`);
  }
  return null;
}

function valider(schema, entree) {
  const resultat = schema.safeParse(entree);
  return Object.assign(resultat, { entree });
}

// ---------------------------------------------------------------------------
// Référentiels saisis à la main (familles, modules)

const familles = famillesFichierSchema.parse(JSON.parse(readFileSync(join(racine, 'data', 'familles.json'), 'utf8'))).familles;
const modules = modulesFichierSchema.parse(JSON.parse(readFileSync(join(racine, 'data', 'modules.json'), 'utf8'))).modules;
const idsFamilles = new Set(familles.map((f) => f.id));
const idsModules = new Set(modules.map((m) => m.id));

// ---------------------------------------------------------------------------
// Lecture du classeur

if (!existsSync(cheminClasseur)) {
  console.error(`Classeur introuvable : ${cheminClasseur}`);
  process.exit(1);
}
const classeur = new ExcelJS.Workbook();
await classeur.xlsx.readFile(cheminClasseur);

const lignesCourants = lireOnglet(classeur, 'Courants', [
  'id', 'nom', 'famille', 'lignees', 'modules', 'alias', 'emergence_annee', 'emergence_libelle',
  'a_verifier', 'textes_reference', 'figures', 'en_dialogue_avec', 'statut', 'sources',
]);
const lignesTribunal = lireOnglet(classeur, 'Tribunal', ['courant', 'idee', 'verdict', 'explication', 'sources']);
const lignesRelations = lireOnglet(classeur, 'Relations', ['source', 'cible', 'type', 'date', 'note', 'sources', 'a_verifier']);
const lignesThematiques = lireOnglet(classeur, 'Thematiques', [
  'id', 'nom', 'ordre', 'pole0', 'pole10', 'poles_valides', 'orientation', 'statut',
]);
const lignesCriteres = lireOnglet(
  classeur,
  'Criteres',
  ['theme', 'id', 'libelle', 'pole0', 'pole10', 'ancre_0', 'ancre_2_5', 'ancre_5', 'ancre_7_5', 'ancre_10'],
  ['libelle_court'],
);
const lignesScores = lireOnglet(classeur, 'Scores', [
  'courant', 'critere', 'couche', 'valeur', 'min', 'max', 'conteste', 'justification', 'sources',
]);
const lignesListes = lireOnglet(classeur, 'Listes', ['familles', 'modules']);

// Les listes déroulantes doivent refléter familles.json et modules.json.
for (const [colonne, attendus] of [
  ['familles', idsFamilles],
  ['modules', idsModules],
]) {
  const saisis = new Set(lignesListes.map((l) => l[colonne]).filter((v) => v !== null).map(String));
  const manquants = [...attendus].filter((id) => !saisis.has(id));
  const enTrop = [...saisis].filter((id) => !attendus.has(id));
  if (manquants.length + enTrop.length > 0) {
    avertir(
      `Listes, colonne ${colonne} : différente de data/${colonne}.json` +
        (manquants.length ? ` (absents : ${manquants.join(', ')})` : '') +
        (enTrop.length ? ` (inconnus : ${enTrop.join(', ')})` : ''),
    );
  }
}

// ---------------------------------------------------------------------------
// Courants

const colonnesCourant = {
  id: 'id', nom: 'nom', alias: 'alias', famille: 'famille', lignees: 'lignees', modules: 'modules',
  emergence: 'emergence_annee', textesReference: 'textes_reference', figures: 'figures',
  enDialogueAvec: 'en_dialogue_avec', statut: 'statut', sources: 'sources',
};

const courants = new Map();
const ligneCourant = new Map();
for (const l of lignesCourants) {
  const O = 'Courants';
  const annee = nombre(O, l, 'emergence_annee');
  if (annee !== null && !Number.isInteger(annee)) erreur(O, l._ligne, 'emergence_annee', `${annee} n’est pas une année entière`);
  const libelle = texte(O, l, 'emergence_libelle');
  const aVerifier = ouiNon(O, l, 'a_verifier');
  const entree = {
    id: texte(O, l, 'id'),
    nom: texte(O, l, 'nom'),
    alias: liste(O, l, 'alias'),
    famille: texte(O, l, 'famille'),
    lignees: liste(O, l, 'lignees'),
    modules: liste(O, l, 'modules'),
    // Sans indication, une date est considérée comme à vérifier.
    emergence: annee === null && libelle === null ? null : { annee, ...(libelle && { libelle }), aVerifier: aVerifier ?? true },
    textesReference: liste(O, l, 'textes_reference').map(texteReference),
    figures: liste(O, l, 'figures'),
    enDialogueAvec: liste(O, l, 'en_dialogue_avec'),
    tribunal: [],
    statut: texte(O, l, 'statut'),
    sources: liste(O, l, 'sources'),
  };
  const courant = rapporterZod(O, l, valider(courantSchema, entree), colonnesCourant);
  if (!courant) continue;
  if (courants.has(courant.id)) {
    erreur(O, l._ligne, 'id', `identifiant « ${courant.id} » déjà utilisé ligne ${ligneCourant.get(courant.id)}`);
    continue;
  }
  courants.set(courant.id, courant);
  ligneCourant.set(courant.id, l._ligne);
}

for (const [id, c] of courants) {
  const ligne = ligneCourant.get(id);
  if (!idsFamilles.has(c.famille)) erreur('Courants', ligne, 'famille', `famille inconnue « ${c.famille} »`);
  for (const f of c.lignees) {
    if (!idsFamilles.has(f)) erreur('Courants', ligne, 'lignees', `famille inconnue « ${f} »`);
    if (f === c.famille) erreur('Courants', ligne, 'lignees', `« ${f} » est déjà la famille principale`);
  }
  for (const m of c.modules) if (!idsModules.has(m)) erreur('Courants', ligne, 'modules', `module inconnu « ${m} »`);
  for (const d of c.enDialogueAvec) {
    if (!courants.has(d)) erreur('Courants', ligne, 'en_dialogue_avec', `courant inconnu « ${d} »`);
    if (d === id) erreur('Courants', ligne, 'en_dialogue_avec', 'le courant se cite lui-même');
  }
}
const datesAVerifier = [...courants.values()].filter((c) => c.emergence?.aVerifier).map((c) => c.id);
if (datesAVerifier.length) avertir(`${datesAVerifier.length} date(s) d’émergence à vérifier : ${datesAVerifier.join(', ')}`);

// ---------------------------------------------------------------------------
// Tribunal

const entreeTribunal = courantSchema.shape.tribunal.element;
for (const l of lignesTribunal) {
  const O = 'Tribunal';
  const id = texte(O, l, 'courant');
  const entree = {
    idee: texte(O, l, 'idee'),
    verdict: texte(O, l, 'verdict'),
    explication: texte(O, l, 'explication') ?? '',
    sources: liste(O, l, 'sources'),
  };
  const t = rapporterZod(O, l, valider(entreeTribunal, entree));
  const courant = id ? courants.get(id) : undefined;
  if (!courant) {
    erreur(O, l._ligne, 'courant', id ? `courant inconnu « ${id} »` : 'courant manquant');
    continue;
  }
  if (t) courant.tribunal.push(t);
}

// ---------------------------------------------------------------------------
// Relations

const relations = [];
const clesRelations = new Map();
for (const l of lignesRelations) {
  const O = 'Relations';
  const entree = {
    source: texte(O, l, 'source'),
    cible: texte(O, l, 'cible'),
    type: texte(O, l, 'type'),
    date: typeof l.date === 'number' ? l.date : texte(O, l, 'date'),
    note: texte(O, l, 'note'),
    sources: liste(O, l, 'sources'),
    aVerifier: ouiNon(O, l, 'a_verifier') ?? true,
  };
  const r = rapporterZod(O, l, valider(relationSchema, entree), { aVerifier: 'a_verifier' });
  if (!r) continue;
  if (!courants.has(r.source)) erreur(O, l._ligne, 'source', `courant inconnu « ${r.source} »`);
  if (!courants.has(r.cible)) erreur(O, l._ligne, 'cible', `courant inconnu « ${r.cible} »`);
  if (r.source === r.cible) erreur(O, l._ligne, 'cible', 'relation d’un courant avec lui-même');
  const cle = `${r.source}|${r.cible}|${r.type}`;
  if (clesRelations.has(cle)) erreur(O, l._ligne, null, `relation déjà saisie ligne ${clesRelations.get(cle)}`);
  clesRelations.set(cle, l._ligne);
  relations.push(r);
}

// ---------------------------------------------------------------------------
// Thématiques et critères

const grilles = new Map();
const ordres = new Map();
for (const l of lignesThematiques) {
  const O = 'Thematiques';
  const valides = ouiNon(O, l, 'poles_valides');
  const entree = {
    _note: NOTE_GENEREE,
    id: texte(O, l, 'id'),
    nom: texte(O, l, 'nom'),
    ordre: nombre(O, l, 'ordre'),
    pole0: texte(O, l, 'pole0') ?? A_COMPLETER,
    pole10: texte(O, l, 'pole10') ?? A_COMPLETER,
    polesAValider: valides === null ? true : !valides,
    statut: texte(O, l, 'statut') ?? '',
    orientation: texte(O, l, 'orientation') ?? A_COMPLETER,
    criteres: [],
  };
  const g = rapporterZod(O, l, valider(grilleSchema, entree), { polesAValider: 'poles_valides' });
  if (!g) continue;
  if (grilles.has(g.id)) erreur(O, l._ligne, 'id', `thématique « ${g.id} » déjà saisie`);
  if (ordres.has(g.ordre)) erreur(O, l._ligne, 'ordre', `ordre ${g.ordre} déjà utilisé par « ${ordres.get(g.ordre)} »`);
  grilles.set(g.id, g);
  ordres.set(g.ordre, g.id);
}

const criteres = new Map();
for (const l of lignesCriteres) {
  const O = 'Criteres';
  const theme = texte(O, l, 'theme');
  const grille = theme ? grilles.get(theme) : undefined;
  if (!grille) erreur(O, l._ligne, 'theme', theme ? `thématique inconnue « ${theme} »` : 'thématique manquante');
  const ancre = (colonne) => texte(O, l, colonne) ?? A_COMPLETER;
  const libelleCourt = texte(O, l, 'libelle_court');
  const entree = {
    id: texte(O, l, 'id'),
    libelle: texte(O, l, 'libelle') ?? A_COMPLETER,
    ...(libelleCourt && { libelleCourt }),
    pole0: texte(O, l, 'pole0') ?? A_COMPLETER,
    pole10: texte(O, l, 'pole10') ?? A_COMPLETER,
    ancres: { 0: ancre('ancre_0'), 2.5: ancre('ancre_2_5'), 5: ancre('ancre_5'), 7.5: ancre('ancre_7_5'), 10: ancre('ancre_10') },
  };
  const c = rapporterZod(O, l, valider(critereSchema, entree), { libelleCourt: 'libelle_court' });
  if (!c || !grille) continue;
  if (criteres.has(c.id)) {
    erreur(O, l._ligne, 'id', `critère « ${c.id} » déjà saisi`);
    continue;
  }
  grille.criteres.push(c);
  criteres.set(c.id, grille.id);
}

// ---------------------------------------------------------------------------
// Scores

const scores = new Map();
const notesParTheme = new Map([...grilles.keys()].map((id) => [id, 0]));
const sansSource = new Map();
for (const l of lignesScores) {
  const O = 'Scores';
  const valeur = nombre(O, l, 'valeur');
  if (valeur === null) {
    // Ligne préparée mais pas encore notée : ignorée tant que rien d'autre n'est saisi.
    if (['min', 'max', 'conteste', 'justification', 'sources'].some((c) => l[c] !== null)) {
      erreur(O, l._ligne, 'valeur', 'note manquante alors que la ligne est renseignée');
    }
    continue;
  }
  const id = texte(O, l, 'courant');
  const critere = texte(O, l, 'critere');
  const couche = texte(O, l, 'couche');
  const min = nombre(O, l, 'min');
  const max = nombre(O, l, 'max');
  const erreursAvant = erreurs.length;
  if (!id || !courants.has(id)) erreur(O, l._ligne, 'courant', id ? `courant inconnu « ${id} »` : 'courant manquant');
  if (!critere || !criteres.has(critere)) {
    erreur(O, l._ligne, 'critere', critere ? `critère inconnu « ${critere} »` : 'critère manquant');
  }
  if (couche !== 'doctrine' && couche !== 'historique') {
    erreur(O, l._ligne, 'couche', couche ? `« ${couche} » : « doctrine » ou « historique » attendu` : 'couche manquante');
  }
  for (const [colonne, v] of [['valeur', valeur], ['min', min], ['max', max]]) {
    if (v !== null && (v < 0 || v > 10)) erreur(O, l._ligne, colonne, `${v} est hors de l’échelle 0-10`);
  }
  if (min !== null && min > valeur) erreur(O, l._ligne, 'min', `min (${min}) supérieur à la valeur (${valeur})`);
  if (max !== null && max < valeur) erreur(O, l._ligne, 'max', `max (${max}) inférieur à la valeur (${valeur})`);
  if (!id || !critere || (couche !== 'doctrine' && couche !== 'historique') || erreurs.length > erreursAvant) continue;
  const note = rapporterZod(
    O,
    l,
    valider(valeurScoreSchema, {
      valeur,
      min,
      max,
      conteste: ouiNon(O, l, 'conteste') ?? false,
      justification: texte(O, l, 'justification') ?? '',
      sources: liste(O, l, 'sources'),
    }),
  );
  if (!note) continue;

  const fichier = scores.get(id) ?? { _note: NOTE_GENEREE, courant: id, scores: {}, demo: false };
  const couches = fichier.scores[critere] ?? { doctrine: null, historique: null };
  if (couches[couche]) {
    erreur(O, l._ligne, 'couche', `note « ${couche} » de ${id} sur ${critere} déjà saisie`);
    continue;
  }
  couches[couche] = note;
  fichier.scores[critere] = couches;
  scores.set(id, fichier);
  if (couche === 'doctrine') notesParTheme.set(criteres.get(critere), (notesParTheme.get(criteres.get(critere)) ?? 0) + 1);
  if (note.sources.length === 0) sansSource.set(id, (sansSource.get(id) ?? 0) + 1);
}
for (const [id, n] of sansSource) avertir(`${id} : ${n} note(s) sans source (affichées comme provisoires)`);

// ---------------------------------------------------------------------------
// Arrêt en cas d'erreur : aucun fichier n'est écrit.

if (erreurs.length > 0) {
  console.error(`Import refusé : ${erreurs.length} erreur(s) dans ${affichage(cheminClasseur)}. Aucun fichier modifié.\n`);
  for (const e of erreurs) console.error(`- ${e}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Préparation des fichiers (en mémoire)

/**
 * JSON indenté. Les clés des ancres (« 0 », « 2.5 »…) sont remises dans l'ordre numérique :
 * JavaScript énumère les clés entières avant les autres (0, 5, 10, 2.5, 7.5).
 */
const json = (objet) =>
  `${JSON.stringify(objet, null, 2).replace(/("ancres": \{\n)([\s\S]*?)(\n\s*\})/g, (_, debut, lignes, fin) => {
    const triees = lignes
      .split('\n')
      .map((l) => l.replace(/,$/, ''))
      .sort((a, b) => parseFloat(a.split('"')[1]) - parseFloat(b.split('"')[1]));
    return debut + triees.join(',\n') + fin;
  })}\n`;
const ecritures = new Map();

ecritures.set(join(racine, 'data', 'relations.json'), json({ _note: NOTE_GENEREE, relations }));

const dossierGrilles = join(racine, 'data', 'grilles');
for (const g of grilles.values()) ecritures.set(join(dossierGrilles, `${g.id}.json`), json(grilleOrdonnee(g)));

const dossierScores = join(racine, 'data', 'scores');
const ordreCriteres = [...criteres.keys()];
for (const s of scores.values()) {
  s.scores = Object.fromEntries(ordreCriteres.filter((c) => c in s.scores).map((c) => [c, s.scores[c]]));
  ecritures.set(join(dossierScores, `${s.courant}.json`), json(scoresSchema.parse(s)));
}

const dossierFiches = join(racine, 'src', 'content', 'courants');
const fichesCreees = [];
for (const c of courants.values()) {
  const chemin = join(dossierFiches, `${c.id}.md`);
  let corps = CORPS_INITIAL;
  if (existsSync(chemin)) {
    const fiche = decouperFiche(readFileSync(chemin, 'utf8'));
    if (!fiche) {
      console.error(`Import refusé : ${relative(racine, chemin)} n’a pas d’en-tête --- lisible. Aucun fichier modifié.`);
      process.exit(1);
    }
    corps = fiche.corps;
  } else {
    fichesCreees.push(c.id);
  }
  ecritures.set(chemin, enTeteFiche(c) + corps);
}

/** Fichiers générés devenus obsolètes (grille ou courant retiré du classeur). */
const suppressions = [
  ...fichiersJson(dossierGrilles).filter((f) => !grilles.has(basename(f, '.json'))),
  ...fichiersJson(dossierScores).filter((f) => !scores.has(basename(f, '.json'))),
];
const fichesOrphelines = readdirSync(dossierFiches)
  .filter((f) => f.endsWith('.md') && !courants.has(basename(f, '.md')))
  .map((f) => basename(f, '.md'));
for (const id of fichesOrphelines) avertir(`${id} : fiche présente dans src/content/courants/ mais absente du classeur (conservée)`);

function fichiersJson(dossier) {
  return existsSync(dossier) ? readdirSync(dossier).filter((f) => f.endsWith('.json')).map((f) => join(dossier, f)) : [];
}

/** Ordre des clés identique aux fichiers historiques ; les critères gardent l'ordre du classeur. */
function grilleOrdonnee(g) {
  const { _note, id, nom, ordre, pole0, pole10, polesAValider, statut, orientation, criteres: liste } = g;
  return { _note, id, nom, ordre, pole0, pole10, polesAValider, statut, orientation, criteres: liste };
}

// ---------------------------------------------------------------------------
// Écriture des seuls fichiers modifiés

const modifies = [];
for (const [chemin, contenu] of ecritures) {
  const actuel = existsSync(chemin) ? readFileSync(chemin, 'utf8') : null;
  if (actuel === contenu) continue;
  modifies.push(chemin);
  if (!simulation) {
    mkdirSync(dirname(chemin), { recursive: true });
    writeFileSync(chemin, contenu, 'utf8');
  }
}
if (!simulation) for (const chemin of suppressions) rmSync(chemin);

// ---------------------------------------------------------------------------
// Résumé

const rel = (chemin) => relative(racine, chemin).replaceAll('\\', '/');
const fichesModifiees = modifies.filter((c) => c.startsWith(dossierFiches)).map((c) => basename(c, '.md'));
console.log(`${simulation ? 'Simulation (--dry-run) : rien n’est écrit.\n' : ''}Import de ${affichage(cheminClasseur)}`);
console.log(
  `- Courants : ${courants.size} (${fichesCreees.length} fiche(s) créée(s), ` +
    `${fichesModifiees.filter((id) => !fichesCreees.includes(id)).length} en-tête(s) mis à jour)`,
);
console.log(`- Relations : ${relations.length} ; idées reçues : ${[...courants.values()].reduce((n, c) => n + c.tribunal.length, 0)}`);
const avecBareme = [...grilles.values()].filter((g) => g.criteres.length > 0);
console.log(
  `- Notes (doctrine) par thématique : ${
    avecBareme.map((g) => `${g.id} ${notesParTheme.get(g.id) ?? 0} (${g.criteres.length} critères)`).join(', ') || 'aucune'
  } ; sans critères : ${grilles.size - avecBareme.length} thématique(s)`,
);
console.log(`- Fichiers ${simulation ? 'à modifier' : 'modifiés'} : ${modifies.length ? modifies.map(rel).join(', ') : 'aucun'}`);
if (suppressions.length) console.log(`- Fichiers ${simulation ? 'à supprimer' : 'supprimés'} : ${suppressions.map(rel).join(', ')}`);

// Données de démonstration remplacées (docs/specs/05-import-excel.md).
const cheminDemo = join(racine, 'data', 'seed', 'scores-demo-economie.json');
if (existsSync(cheminDemo)) {
  const demo = JSON.parse(readFileSync(cheminDemo, 'utf8'));
  const grilleDemo = grilles.get(demo.grille);
  const restants = Object.keys(demo.scores).filter(
    (id) => !grilleDemo?.criteres.some((c) => scores.get(id)?.scores[c.id]?.doctrine),
  );
  console.log(
    restants.length === 0
      ? `- Toutes les notes de démonstration (${demo.grille}) sont remplacées : data/seed/${basename(cheminDemo)} peut être retiré après validation.`
      : `- Notes de démonstration encore utilisées (${demo.grille}) : ${restants.join(', ')}`,
  );
}

if (avertissements.length) {
  console.log(`\nAvertissements (${avertissements.length}) :`);
  for (const a of avertissements) console.log(`- ${a}`);
}
