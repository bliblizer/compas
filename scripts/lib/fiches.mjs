// Lecture et écriture des fiches src/content/courants/<id>.md :
// l'en-tête (frontmatter) est généré, le corps rédigé est conservé à l'octet près.

/** En-tête YAML délimité par --- en tout début de fichier. */
const EN_TETE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Corps d'une fiche nouvellement créée (titres fixes, voir docs/redaction-fiches.md). */
export const CORPS_INITIAL = `
## Définition

[À COMPLÉTER]

## Principes fondamentaux

[À COMPLÉTER]
`;

/** Sépare l'en-tête YAML (texte brut) du corps ; null si l'en-tête est absent. */
export function decouperFiche(contenu) {
  const m = contenu.match(EN_TETE);
  if (!m) return null;
  return { enTete: m[1], corps: contenu.slice(m[0].length) };
}

/** Chaîne YAML entre guillemets doubles (la syntaxe JSON est du YAML valide). */
const texte = (s) => JSON.stringify(s);
const textes = (valeurs) => `[${valeurs.map(texte).join(', ')}]`;
const identifiants = (valeurs) => `[${valeurs.join(', ')}]`;

function emergence(e) {
  if (!e) return 'null';
  const champs = [`annee: ${e.annee ?? 'null'}`];
  if (e.libelle) champs.push(`libelle: ${texte(e.libelle)}`);
  champs.push(`aVerifier: ${e.aVerifier}`);
  return `{ ${champs.join(', ')} }`;
}

function textesReference(liste) {
  if (liste.length === 0) return ' []';
  return liste
    .map((t) => `\n  - { titre: ${texte(t.titre)}, auteurs: ${texte(t.auteurs)}, annee: ${t.annee ?? 'null'} }`)
    .join('');
}

function tribunal(liste) {
  if (liste.length === 0) return ' []';
  return liste
    .map(
      (t) =>
        `\n  - idee: ${texte(t.idee)}\n    verdict: ${t.verdict}\n    explication: ${texte(t.explication)}\n    sources: ${textes(t.sources)}`,
    )
    .join('');
}

/** En-tête complet (délimiteurs compris) d'un courant validé par courantSchema. */
export function enTeteFiche(c) {
  return `---
id: ${c.id}
nom: ${texte(c.nom)}
alias: ${textes(c.alias)}
famille: ${c.famille}
lignees: ${identifiants(c.lignees)}
modules: ${identifiants(c.modules)}
emergence: ${emergence(c.emergence)}
textesReference:${textesReference(c.textesReference)}
figures: ${textes(c.figures)}
enDialogueAvec: ${identifiants(c.enDialogueAvec)}
tribunal:${tribunal(c.tribunal)}
statut: ${c.statut}
sources: ${textes(c.sources)}
---
`;
}
