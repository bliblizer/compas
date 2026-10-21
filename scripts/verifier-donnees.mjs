// Valide le référentiel : schémas Zod et références croisées.
// Usage : npm run check:data (code de sortie 1 en cas d'erreur).
// Les schémas sont importés depuis src/lib/schemas.ts (Node >= 22.18 retire les types).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import {
  carteDemoSchema,
  catalogueSchema,
  courantSchema,
  famillesFichierSchema,
  grilleSchema,
  modulesFichierSchema,
  relationsFichierSchema,
  scoresDemoSchema,
  scoresSchema,
} from '../src/lib/schemas.ts';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const erreurs = [];
const avertissements = [];

const rel = (chemin) => relative(racine, chemin).replaceAll('\\', '/');
const erreur = (fichier, message) => erreurs.push(`${rel(fichier)} : ${message}`);
const fichiersJson = (dossier) =>
  existsSync(dossier) ? readdirSync(dossier).filter((f) => f.endsWith('.json')).map((f) => join(dossier, f)) : [];

/** Lit et valide un fichier JSON ; renvoie null en cas d'échec. */
function charger(chemin, schema) {
  let brut;
  try {
    brut = JSON.parse(readFileSync(chemin, 'utf8'));
  } catch (e) {
    erreur(chemin, `JSON illisible (${e.message})`);
    return null;
  }
  return valider(chemin, schema, brut);
}

function valider(chemin, schema, brut) {
  const resultat = schema.safeParse(brut);
  if (resultat.success) return resultat.data;
  for (const issue of resultat.error.issues) {
    erreur(chemin, `${issue.path.join('.') || '(racine)'} — ${issue.message}`);
  }
  return null;
}

function doublons(chemin, ids, quoi) {
  const vus = new Set();
  for (const id of ids) {
    if (vus.has(id)) erreur(chemin, `${quoi} en double : ${id}`);
    vus.add(id);
  }
  return vus;
}

// Familles et modules

const cheminFamilles = join(racine, 'data', 'familles.json');
const familles = charger(cheminFamilles, famillesFichierSchema)?.familles ?? [];
const idsFamilles = doublons(cheminFamilles, familles.map((f) => f.id), 'famille');
doublons(cheminFamilles, familles.map((f) => String(f.ordre)), 'ordre de famille');

const cheminModules = join(racine, 'data', 'modules.json');
const modules = charger(cheminModules, modulesFichierSchema)?.modules ?? [];
const idsModules = doublons(cheminModules, modules.map((m) => m.id), 'module');

// Fiches de courants (frontmatter)

const dossierFiches = join(racine, 'src', 'content', 'courants');
const courants = [];
for (const nom of readdirSync(dossierFiches).filter((f) => f.endsWith('.md'))) {
  const chemin = join(dossierFiches, nom);
  const contenu = readFileSync(chemin, 'utf8');
  const bloc = contenu.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!bloc) {
    erreur(chemin, 'frontmatter absent');
    continue;
  }
  let brut;
  try {
    brut = parseYaml(bloc[1]);
  } catch (e) {
    erreur(chemin, `frontmatter YAML illisible (${e.message})`);
    continue;
  }
  const courant = valider(chemin, courantSchema, brut);
  if (!courant) continue;
  if (courant.id !== basename(nom, '.md')) erreur(chemin, `id « ${courant.id} » différent du nom de fichier`);
  courants.push({ chemin, courant });
}
const idsCourants = doublons(dossierFiches, courants.map((c) => c.courant.id), 'courant');

for (const { chemin, courant } of courants) {
  if (!idsFamilles.has(courant.famille)) erreur(chemin, `famille inconnue : ${courant.famille}`);
  for (const l of courant.lignees) {
    if (!idsFamilles.has(l)) erreur(chemin, `lignée inconnue (famille attendue) : ${l}`);
    if (l === courant.famille) erreur(chemin, `la lignée ${l} répète la famille principale`);
  }
  for (const m of courant.modules) if (!idsModules.has(m)) erreur(chemin, `module inconnu : ${m}`);
  for (const d of courant.enDialogueAvec) {
    if (!idsCourants.has(d)) erreur(chemin, `enDialogueAvec : courant inconnu ${d}`);
    if (d === courant.id) erreur(chemin, 'enDialogueAvec : le courant se cite lui-même');
  }
}

// Catalogue de départ

const cheminCatalogue = join(racine, 'data', 'seed', 'courants-catalogue.json');
const catalogue = charger(cheminCatalogue, catalogueSchema)?.courants ?? [];
doublons(cheminCatalogue, catalogue.map((c) => c.id), 'courant');
for (const c of catalogue) {
  if (!idsFamilles.has(c.famille)) erreur(cheminCatalogue, `${c.id} : famille inconnue ${c.famille}`);
  for (const l of c.lignees) if (!idsFamilles.has(l)) erreur(cheminCatalogue, `${c.id} : lignée inconnue ${l}`);
  if (!idsCourants.has(c.id)) erreur(cheminCatalogue, `${c.id} : fiche absente (lancer npm run fiches)`);
}
const idsCatalogue = new Set(catalogue.map((c) => c.id));
for (const id of idsCourants) {
  if (!idsCatalogue.has(id)) avertissements.push(`src/content/courants/${id}.md : courant absent du catalogue`);
}

// Relations

const cheminRelations = join(racine, 'data', 'relations.json');
const relations = charger(cheminRelations, relationsFichierSchema)?.relations ?? [];
const clesRelations = new Set();
for (const r of relations) {
  const libelle = `${r.source} → ${r.cible} (${r.type})`;
  if (!idsCourants.has(r.source)) erreur(cheminRelations, `${libelle} : source inconnue`);
  if (!idsCourants.has(r.cible)) erreur(cheminRelations, `${libelle} : cible inconnue`);
  if (r.source === r.cible) erreur(cheminRelations, `${libelle} : relation d'un courant avec lui-même`);
  if (clesRelations.has(libelle)) erreur(cheminRelations, `${libelle} : relation en double`);
  clesRelations.add(libelle);
}

// Grilles et critères

const grilles = new Map();
const criteres = new Map();
for (const chemin of fichiersJson(join(racine, 'data', 'grilles'))) {
  const grille = charger(chemin, grilleSchema);
  if (!grille) continue;
  if (grille.id !== basename(chemin, '.json')) erreur(chemin, `id « ${grille.id} » différent du nom de fichier`);
  if (grilles.has(grille.id)) erreur(chemin, `grille en double : ${grille.id}`);
  grilles.set(grille.id, grille);
  for (const c of grille.criteres) {
    if (criteres.has(c.id)) erreur(chemin, `critère en double : ${c.id} (déjà dans ${criteres.get(c.id)})`);
    criteres.set(c.id, grille.id);
  }
}
doublons(join(racine, 'data', 'grilles'), [...grilles.values()].map((g) => String(g.ordre)), 'ordre de grille');

// Scores

for (const chemin of fichiersJson(join(racine, 'data', 'scores'))) {
  const scores = charger(chemin, scoresSchema);
  if (!scores) continue;
  if (scores.courant !== basename(chemin, '.json')) erreur(chemin, `courant « ${scores.courant} » différent du nom de fichier`);
  if (!idsCourants.has(scores.courant)) erreur(chemin, `courant inconnu : ${scores.courant}`);
  for (const [critere, couches] of Object.entries(scores.scores)) {
    if (!criteres.has(critere)) erreur(chemin, `critère inconnu : ${critere}`);
    for (const [couche, s] of Object.entries(couches)) {
      if (!s) continue;
      if (s.min != null && s.min > s.valeur) erreur(chemin, `${critere}.${couche} : min supérieur à la valeur`);
      if (s.max != null && s.max < s.valeur) erreur(chemin, `${critere}.${couche} : max inférieur à la valeur`);
    }
  }
}

// Données de démonstration

const cheminScoresDemo = join(racine, 'data', 'seed', 'scores-demo-economie.json');
const scoresDemo = charger(cheminScoresDemo, scoresDemoSchema);
if (scoresDemo) {
  const grille = grilles.get(scoresDemo.grille);
  if (!grille) erreur(cheminScoresDemo, `grille inconnue : ${scoresDemo.grille}`);
  for (const [id, valeurs] of Object.entries(scoresDemo.scores)) {
    if (!idsCourants.has(id)) erreur(cheminScoresDemo, `courant inconnu : ${id}`);
    if (grille && valeurs.length !== grille.criteres.length) {
      erreur(cheminScoresDemo, `${id} : ${valeurs.length} valeurs pour ${grille.criteres.length} critères`);
    }
  }
}

const cheminCarteDemo = join(racine, 'data', 'seed', 'carte-demo.json');
const carteDemo = charger(cheminCarteDemo, carteDemoSchema);
if (carteDemo) {
  doublons(cheminCarteDemo, carteDemo.positions.map((p) => p.id), 'position');
  for (const p of carteDemo.positions) if (!idsCourants.has(p.id)) erreur(cheminCarteDemo, `courant inconnu : ${p.id}`);
}

// Bilan

for (const a of avertissements) console.warn(`Avertissement — ${a}`);
if (erreurs.length > 0) {
  for (const e of erreurs) console.error(`Erreur — ${e}`);
  console.error(`\n${erreurs.length} erreur(s) dans le référentiel.`);
  process.exit(1);
}
console.log(
  `Référentiel valide : ${familles.length} familles, ${modules.length} modules, ${courants.length} courants, ` +
    `${relations.length} relations, ${grilles.size} grilles, ${criteres.size} critères.`,
);
