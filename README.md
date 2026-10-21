# Compas

Compas cartographie l’ensemble des idéologies politiques, des plus étudiées aux plus marginales.
Il les met en regard de l’offre politique réelle (partis et candidats), à partir de données sourcées.
Le but : montrer, sans militantisme, combien le débat public n’occupe qu’une partie de l’espace des idées, et expliquer pourquoi.

Site : https://bliblizer.github.io/compas/

## Commandes

Prérequis : Node.js 22.18 ou plus récent (24 LTS recommandé).

```
npm install
npm run dev          # site local sur http://localhost:4321/compas/
npm run build        # construit le site dans dist/
npm run preview      # sert le build localement
npm run check:data   # valide data/ et les fiches (schémas, références croisées)
npm run import:excel # importe data/source/compas-referentiel.xlsx (ajouter -- --dry-run pour simuler)
```

Le site est déployé sur GitHub Pages à chaque push sur `main` (`.github/workflows/deploy.yml`).

## Documentation

La conception validée se trouve dans `docs/` ; les instructions de travail dans `CLAUDE.md`.
Les données structurées se saisissent dans `data/source/compas-referentiel.xlsx` ; le texte des fiches, dans `src/content/courants/` (voir `docs/redaction-fiches.md`).
