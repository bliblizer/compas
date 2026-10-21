# Journal des décisions

Format : date — décision — raison. Les décisions de conception viennent des échanges avec Alexandre ; Claude Code ajoute ici les décisions techniques prises pendant l'implémentation.

| Date | Décision | Raison |
|---|---|---|
| 2026-10-21 | Stack : Astro, fiches en Markdown, données en JSON, D3, GitHub Pages | Site statique, gratuit, contenu versionné et relisible |
| 2026-10-21 | Taxonomie en trois couches : familles-racines (14), modules transversaux, position sur les grilles | Les courants ont plusieurs parents ; certaines idéologies sont « fines » |
| 2026-10-21 | Grille universelle, dix thématiques, notes de 0 à 10 à orientation constante | Comparabilité de tous les courants |
| 2026-10-21 | Axes de la carte calculés (ACP) plutôt qu'imposés | Les axes émergent des données ; argument en soi |
| 2026-10-21 | Positions des partis et candidats issues de sources publiées, jamais notées par l'IA | Crédibilité et neutralité de l'Observatoire |
| 2026-10-21 | Conception dans claude.ai (projet Compas), implémentation par Claude Code ; le dépôt fait foi | Séparer décisions de fond et exécution |
| 2026-10-21 | Node 24 LTS (minimum 22.18), npm, Astro avec `trailingSlash: 'always'` et `base: '/compas'` | Le retrait natif des types par Node permet aux scripts `.mjs` d'importer `src/lib/schemas.ts` sans outil de compilation ; URL canoniques avec barre finale, comme les sert GitHub Pages |
| 2026-10-21 | Schémas Zod uniques dans `src/lib/schemas.ts` (import depuis `astro/zod`), partagés par `data.ts`, `content.config.ts` et `scripts/verifier-donnees.mjs` | Une seule définition du modèle ; pas de divergence entre build et contrôle ; pas de seconde version de Zod |
| 2026-10-21 | Schémas stricts (clé inconnue = erreur), `_note` toléré en tête des fichiers JSON | Détecte les fautes de frappe dans les données saisies à la main |
| 2026-10-21 | `sources` : liste de chaînes (référence libre) pour l'instant | Format des sources non encore spécifié ; à structurer lors de la rédaction des premières fiches |
| 2026-10-21 | Le frontmatter `lignees` référence des familles (et non des courants) | Usage constaté dans le catalogue et la fiche Écosocialisme ; contrôlé par `check:data` |
| 2026-10-21 | Données JSON chargées par `import` / `import.meta.glob` et validées à chaque build (`src/lib/data.ts`) | Une donnée invalide fait échouer le build plutôt que de s'afficher |
| 2026-10-21 | `check:data` lancé dans le workflow via `build-cmd` de `withastro/action` (`npm run check:data && npm run build`) | Contrôle avant le build sans seconde installation des dépendances |
| 2026-10-21 | Nom affiché provisoire : « Compas » (la maquette porte « Atlas des idéologies ») ; défini dans `src/lib/site.ts` | Nom public encore à fixer (roadmap) ; un seul endroit à modifier |
| 2026-10-21 | Pied de page : « Critères d'inclusion » et « Sources » pointent vers des ancres de `/methode/` ; « Signaler une erreur » vers les issues GitHub du dépôt | Pas de page dédiée prévue à ce stade |
| 2026-10-21 | Navigation : `aria-current="page"` sur la page exacte, `aria-current="true"` sur la rubrique (ex. une fiche sous Courants) | Le lien de rubrique reste mis en évidence sans annoncer à tort la page courante |
| 2026-10-21 | Chapô de `/candidats/` adapté de la maquette : « notés … à partir de leurs programmes » retiré | Contredisait `methode.md` (aucune notation des acteurs par le site) ; à valider par Alexandre |
