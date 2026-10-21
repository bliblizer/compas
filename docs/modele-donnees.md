# Modèle de données

## Vue d'ensemble

```
Famille 1──n Courant n──n Module
Courant n──n Courant        (Relation : derive, synthese, rupture, opposition)
Thématique 1──n Critère
Courant × Critère ──> Score (couche doctrine / historique)
Acteur (parti, candidat) × Critère ──> Position (sourcée, via correspondance)
```

Tout est versionné dans le dépôt. **Le classeur `data/source/compas-referentiel.xlsx` fait foi** pour les courants (en-tête des fiches), le tribunal, les relations, les thématiques, les critères et les scores : `npm run import:excel` génère à partir de lui `data/relations.json`, `data/grilles/*.json`, `data/scores/*.json` et l'en-tête des fiches (spec 05). Ces fichiers portent une note « Fichier généré » et ne se modifient pas à la main. `familles.json` et `modules.json` restent saisis à la main ; l'onglet `Listes` du classeur doit les refléter.

Les schémas Zod vivent dans `src/lib/schemas.ts` (données JSON) et `src/content.config.ts` (collection `courants`). Un script `npm run check:data` valide l'ensemble et vérifie les références croisées (une relation pointe vers des courants existants, un score vers un critère existant…).

## Familles — `data/familles.json`

```json
{ "familles": [
  { "id": "ecologismes", "nom": "Écologismes", "valeurPivot": "Rapport au vivant et aux limites",
    "couleur": "#2E8B57", "ordre": 10, "exemples": ["Environnementalisme", "Écosocialisme"] }
]}
```

## Modules — `data/modules.json`

```json
{ "modules": [ { "id": "nationalisme", "nom": "Nationalisme", "definition": "…" } ] }
```

## Courant — `src/content/courants/<id>.md`

Le frontmatter porte les données structurées ; le corps porte le texte de la fiche, avec des titres de niveau 2 fixes.

```markdown
---
id: ecosocialisme
nom: Écosocialisme
alias: []
famille: ecologismes
lignees: [marxismes]
modules: []
emergence: { annee: 1985, libelle: "Années 1970 – 1980", aVerifier: true }
textesReference:
  - { titre: "Manifeste écosocialiste", auteurs: "Joel Kovel, Michael Löwy", annee: 2001 }
figures: ["André Gorz", "Michael Löwy", "Joel Kovel"]
enDialogueAvec: [decroissance, communalisme]
tribunal:
  - idee: "C'est du communisme repeint en vert."
    verdict: nuance          # vrai | faux | nuance | depend
    explication: "…"
    sources: []
statut: brouillon            # a_rediger | brouillon | relu | publie
sources: []
---

## Définition
…

## Principes fondamentaux
…

## Mises en œuvre historiques
(optionnel, voir question ouverte dans specs/03-fiche.md)
```

Les cinq parties fixes de la fiche sont : **carte d'identité** (générée depuis le frontmatter), **définition**, **principes fondamentaux**, **arbre généalogique** (généré depuis `relations.json`), **tribunal des idées reçues** (généré depuis `tribunal`). Style : neutre, pas de listes imbriquées.

Le catalogue `data/seed/courants-catalogue.json` est l'historique du catalogue de départ ; les courants se gèrent désormais dans l'onglet `Courants` du classeur, et l'import crée les fiches manquantes.

## Relations — `data/relations.json`

```json
{ "relations": [
  { "source": "environnementalisme", "cible": "ecosocialisme", "type": "derive",
    "date": null, "note": null, "sources": [], "aVerifier": true }
]}
```

## Grille — `data/grilles/<theme>.json`

```json
{ "id": "economie", "nom": "Économie", "ordre": 1,
  "pole0": "Planifié", "pole10": "Marchand", "polesAValider": true,
  "orientation": "10 = pôle marchand sur chaque critère",
  "statut": "…",
  "criteres": [
    { "id": "eco-1", "libelle": "…", "libelleCourt": "…", "pole0": "…", "pole10": "…",
      "ancres": { "0": "…", "2.5": "…", "5": "…", "7.5": "…", "10": "…" } }
  ]}
```

`libelleCourt` (facultatif, 24 caractères au plus, colonne `libelle_court` de l'onglet `Criteres`) est le libellé affiché sur les axes des radars ; le tableau de données affiche `libelle`. Sans libellé court ni libellé, l'axe affiche l'identifiant du critère.

## Scores — `data/scores/<courant>.json`

Un fichier par courant, pour que l'historique Git de chaque courant soit lisible.

```json
{ "courant": "social-democratie",
  "scores": {
    "eco-1": {
      "doctrine":   { "valeur": 6, "min": 5, "max": 7, "conteste": false,
                      "justification": "…", "sources": ["…"] },
      "historique": null
    }
  },
  "demo": false }
```

Un score sans source s'affiche comme provisoire. Un fichier `"demo": true` déclenche le bandeau « Données de démonstration ».

## Acteurs — `data/acteurs/` (itération Observatoire)

```
data/acteurs/acteurs.json          partis et candidats (id, nom, type, scrutin, parti)
data/acteurs/correspondances.json  critère externe → critère Compas, avec règle de conversion
data/acteurs/positions/<id>.json   positions converties, chacune liée à sa source externe
```

Les positions d'acteurs ne sont **jamais** saisies à la main par l'IA. Voir `methode.md`.

## Données calculées (build)

Calculées au build dans `src/lib/`, jamais stockées à la main :

- **projection 2D** des courants (ACP sur les critères notés) et part de variance expliquée ;
- **distances** entre courants (proximités dans les fiches) ;
- **couverture** de l'espace par les acteurs (Observatoire).

## Données de démonstration — `data/seed/`

| Fichier | Contenu |
|---|---|
| `courants-catalogue.json` | 73 courants de départ (familles, lignées, dates indicatives à vérifier) |
| `carte-demo.json` | Positions dessinées à la main pour la carte de la maquette |
| `scores-demo-economie.json` | Valeurs dessinées pour le radar de la maquette |
