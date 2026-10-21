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
| 2026-10-21 | Critères : champ facultatif `libelleCourt` (axes des radars), rempli pour l'économie avec les libellés provisoires de la maquette | Les libellés complets `[À COMPLÉTER — …]` sont illisibles sur un radar ; le tableau garde le libellé complet |
| 2026-10-21 | Proximités : distance = racine de la moyenne des écarts au carré sur les critères notés en commun ; seuil provisoire de 5 critères communs (`SEUIL_CRITERES_COMMUNS`) | Application de `methode.md` ; seuil validé par Alexandre, à revoir quand les notes réelles arriveront |
| 2026-10-21 | Les proximités publiées n'utilisent que les notes réelles ; les données de démonstration servent seulement à ordonner les courants proposés à la superposition | Ne pas publier de statistique tirée de valeurs dessinées à la main |
| 2026-10-21 | Superposition par défaut : le courant noté le plus proche sur la grille affichée ; trois superpositions au plus, motifs 6 4 / 2 3 / 10 4 attribués dans l'ordre d'activation | Règle de la spec 03 (« par défaut, les courants proches »), calculée depuis les données |
| 2026-10-21 | Radar : composant `<compas-radar>` (élément personnalisé, `src/components/viz/Radar.astro`) dessiné par `creerRadar()` (`src/lib/viz/radar.ts`), séries remplaçables par `maj()` | Réutilisable tel quel par le comparateur ; pas de framework UI |
| 2026-10-21 | Couleurs de familles foncées automatiquement jusqu'à 3:1 sur blanc pour les tracés (`couleurLisible`), 4,5:1 pour le texte | Contraste WCAG des éléments graphiques (Libéralismes #C9940A trop clair) sans modifier `familles.json` |
| 2026-10-21 | Markdown : processeur `unified` (`@astrojs/markdown-remark`) au lieu de Sätteri (défaut d'Astro 7) ; plugin `src/lib/markdown/rehype-fiche.ts` | Le plugin découpe les fiches en sections et met les principes en cartes ; l'API des plugins hast de Sätteri n'est pas documentée |
| 2026-10-21 | Profil par grille : panneaux et tableaux de notes générés au build, D3 ne fait que dessiner le radar | Contenu lisible sans JavaScript ; une seule source pour le tableau accessible |
| 2026-10-21 | Fiche : section « Sources de cette fiche » en fin d'article ; liens « Voir dans la frise » et « Comparer avec les candidats » avec `?courant=<id>` | `methode.md` (section Sources) ; paramètre d'URL prévu par les specs 01, 02 et 04 |
| 2026-10-21 | Le classeur `data/source/compas-referentiel.xlsx` fait foi pour les données structurées ; `relations.json`, `grilles/*.json`, `scores/*.json` et l'en-tête des fiches sont générés par `npm run import:excel` ; le corps des fiches reste rédigé dans le Markdown | Spec 05 : saisie confortable pour Alexandre, texte rédigé versionné à part ; l'import ne touche jamais au corps |
| 2026-10-21 | Lecture du classeur avec `exceljs` (valeurs mises en cache des formules, jamais les formules) | Bibliothèque Node maintenue, sans Python ; `npm audit` signale une vulnérabilité modérée (dépendance `uuid`) sans portée ici : l'outil lit seulement le classeur du dépôt, en local |
| 2026-10-21 | Import atomique : tout est validé et calculé en mémoire, rien n'est écrit en cas d'erreur ; seuls les fichiers dont le contenu change sont réécrits ; les grilles et scores absents du classeur sont supprimés ; les fiches absentes du classeur sont conservées avec un avertissement | Pas d'état intermédiaire ; diff Git minimal ; aucun texte rédigé n'est supprimé automatiquement |
| 2026-10-21 | Colonnes repérées par leur en-tête (ligne 1), pas par leur position ; `libelle_court` (Criteres) est facultative ; `mvp`, `theme` et `controle` sont ignorées | Le classeur peut évoluer sans casser l'import |
| 2026-10-21 | Cellule vide : liste vide, `null`, ou `[À COMPLÉTER]` pour les textes obligatoires des thématiques et critères ; `a_verifier` vide = date à vérifier ; `conteste` vide = non ; ligne de Scores sans note ignorée | Le classeur livré contient des lignes préparées non remplies |
| 2026-10-21 | Familles et modules restent dans `familles.json` et `modules.json` (couleurs, valeurs pivots) ; l'onglet `Listes` est comparé à ces fichiers (avertissement en cas d'écart) | Le classeur ne porte que les identifiants et noms |
| 2026-10-21 | Messages de validation Zod en français (`z.config(z.locales.fr())`) dans les scripts | Rapports lisibles par Alexandre |
| 2026-10-21 | `scripts/generer-fiches.mjs` et `npm run fiches` retirés ; `check:data` ne compare plus les fiches au catalogue de départ | L'import crée les fiches manquantes ; le catalogue n'est plus qu'un historique |
