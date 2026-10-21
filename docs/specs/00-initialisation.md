# Spec 00 — Initialisation

## Objectif

Avoir le site en ligne sur `https://bliblizer.github.io/compas/`, avec le gabarit des maquettes, la navigation complète, des pages vides et un référentiel de données chargé et validé. Rien de spectaculaire : une fondation propre.

## À lire avant

`CLAUDE.md`, `docs/modele-donnees.md`, `docs/design.md`.

## Périmètre

### 1. Projet Astro

- Initialiser Astro **dans le dépôt existant** sans écraser `README.md`, `CLAUDE.md`, `docs/` ni `data/` (créer le projet dans un dossier temporaire puis déplacer les fichiers si l'outil refuse un dossier non vide).
- TypeScript strict, `site: 'https://bliblizer.github.io'`, `base: '/compas'`.
- Dépendances : `d3`, `zod` (ou celui fourni par Astro). Pas d'autre framework.
- `.gitignore` adapté (node_modules, dist, .astro).

### 2. Déploiement

- Workflow `.github/workflows/deploy.yml` avec l'action officielle `withastro/action`, déclenché à chaque push sur `main`.
- **Action manuelle d'Alexandre**, à lui rappeler à la fin : dans GitHub, *Settings › Pages › Build and deployment › Source : GitHub Actions*.

### 3. Design et gabarit

- `src/styles/tokens.css` avec les tokens de `docs/design.md`, chargement des trois polices Google Fonts.
- `src/layouts/BaseLayout.astro` : en-tête (logo, navigation, champ de recherche inactif), contenu, pied de page (Méthode et barèmes · Critères d'inclusion · Sources · Signaler une erreur).
- Le lien de navigation de la page courante est marqué `aria-current="page"`.
- Tous les liens internes respectent la `base` (`import.meta.env.BASE_URL`).

### 4. Pages (contenu provisoire)

| Route | Page | Contenu provisoire |
|---|---|---|
| `/` | Carte doctrinale | Surtitre, h1 et chapô de la maquette, encadré « Carte à venir » |
| `/genealogie/` | Généalogie | Titre et chapô de la maquette |
| `/courants/` | Index des courants | Liste réelle des courants groupés par famille (depuis la collection) |
| `/courants/[id]/` | Fiche | Nom, famille, statut ; reste à venir |
| `/candidats/` | Observatoire | Titre et chapô de la maquette |
| `/methode/` | Méthode | Plan de `docs/methode.md`, sections `[À COMPLÉTER]` |
| `/pourquoi/` | Pourquoi le débat est-il si resserré ? | Plan de `docs/methode.md` |

### 5. Données

- `src/lib/schemas.ts` : schémas Zod pour familles, modules, relations, grilles, scores (voir `modele-donnees.md`).
- `src/lib/data.ts` : fonctions de chargement typées (`getFamilles()`, `getRelations()`, `getGrilles()`, `getScores()`…).
- `src/content.config.ts` : collection `courants` (glob sur `src/content/courants/*.md`) avec le schéma du frontmatter.
- `scripts/generer-fiches.mjs` : crée un fichier `src/content/courants/<id>.md` par entrée de `data/seed/courants-catalogue.json` (frontmatter rempli, corps avec les titres fixes et `[À COMPLÉTER]`). Ne jamais écraser une fiche existante.
- `scripts/verifier-donnees.mjs`, exposé en `npm run check:data` : valide les schémas et les références croisées (familles, lignées, relations, critères). Lancé aussi dans le workflow avant le build.

### 6. Documentation

- Créer `docs/decisions.md` avec les décisions prises pendant cette itération.
- Mettre à jour `README.md` : présentation en trois lignes, commandes, lien vers le site.
- Mettre à jour la section « État actuel » de `CLAUDE.md` et le statut dans `docs/roadmap.md`.

## Critères d'acceptation

- `npm run build` et `npm run check:data` passent.
- Le site est en ligne et la navigation fonctionne entre toutes les pages, liens et polices compris, sous `/compas/`.
- `/courants/` liste les 73 courants du catalogue, groupés par les 14 familles dans l'ordre de `familles.json`, avec leur pastille de couleur.
- Le rendu est utilisable à 375 px de large.

## Hors périmètre

Toute visualisation D3, la recherche, le contenu rédigé des fiches.
