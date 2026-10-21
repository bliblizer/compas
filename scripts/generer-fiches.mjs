// Crée une fiche src/content/courants/<id>.md par courant du catalogue
// (data/seed/courants-catalogue.json). N'écrase jamais une fiche existante.
// Usage : npm run fiches
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const dossierFiches = join(racine, 'src', 'content', 'courants');
const catalogue = JSON.parse(readFileSync(join(racine, 'data', 'seed', 'courants-catalogue.json'), 'utf8'));

/** Chaîne YAML entre guillemets doubles (la syntaxe JSON est du YAML valide). */
const texte = (s) => JSON.stringify(s);
const liste = (valeurs) => `[${valeurs.map(texte).join(', ')}]`;

function emergence(e) {
  if (!e) return 'null';
  const champs = [`annee: ${e.annee ?? 'null'}`];
  if (e.libelle) champs.push(`libelle: ${texte(e.libelle)}`);
  champs.push(`aVerifier: ${e.aVerifier}`);
  return `{ ${champs.join(', ')} }`;
}

function fiche(c) {
  return `---
id: ${c.id}
nom: ${texte(c.nom)}
alias: ${liste(c.alias)}
famille: ${c.famille}
lignees: [${c.lignees.join(', ')}]
modules: []
emergence: ${emergence(c.emergence)}
textesReference: []
figures: []
enDialogueAvec: []
tribunal: []
statut: ${c.statut}
sources: []
---

## Définition

[À COMPLÉTER]

## Principes fondamentaux

[À COMPLÉTER]
`;
}

mkdirSync(dossierFiches, { recursive: true });
let creees = 0;
let conservees = 0;
for (const courant of catalogue.courants) {
  const chemin = join(dossierFiches, `${courant.id}.md`);
  if (existsSync(chemin)) {
    conservees++;
    continue;
  }
  writeFileSync(chemin, fiche(courant), { encoding: 'utf8', flag: 'wx' });
  creees++;
}
console.log(`${creees} fiche(s) créée(s), ${conservees} fiche(s) existante(s) conservée(s).`);
