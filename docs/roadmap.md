# Feuille de route

Principe : une URL en ligne dès la première itération, puis une brique à la fois. Chaque itération a sa spec dans `docs/specs/`. Les specs marquées « à écrire » seront produites lors de la conception, avant leur implémentation.

## Itérations

| # | Itération | Spec | Contenu | Statut |
|---|---|---|---|---|
| 0 | Initialisation | `00-initialisation.md` | Astro, déploiement Pages, gabarit, pages vides, chargement et validation des données, fiches vides générées | Fait (déploiement à activer) |
| 1 | Fiches courants | `03-fiche.md` | Index des courants, page fiche, radar par grille avec superposition | Fait |
| 2 | Carte doctrinale | `01-carte.md` | Carte en mode démo, puis projection ACP dès que les données le permettent | À faire |
| 3 | Généalogie | `02-genealogie.md` | Frise par familles depuis `relations.json` | À faire |
| 4 | Import des grilles Excel | `05-import-excel.md` | Script `npm run import:excel` : classeur → `data/` et en-tête des fiches | Fait (critères et notes à saisir) |
| 5 | Observatoire | `04-candidats.md` | Page candidats, d'abord en démo anonyme, puis données réelles | À faire |
| 6 | Pages éditoriales | à écrire | Méthode, « Pourquoi le débat est-il si resserré ? », À propos | À rédiger |
| 7 | Comparateur dédié | à écrire | Page de comparaison libre de 2 à 4 courants | Plus tard |
| 8 | Quiz de positionnement | à écrire | Situer l'utilisateur dans l'espace | Plus tard |

L'ordre 1 → 2 → 3 permet d'avoir vite une fiche réelle et un radar fonctionnel, la seule visualisation qui dispose déjà de données (économie).

## Objectif MVP

Environ 15 courants rédigés et notés sur Économie et État et pouvoir, la carte calculée, le comparateur de radars et l'Observatoire avec les principaux partis français, en ligne avant la campagne présidentielle de 2027.

### Proposition de 15 courants pour le MVP (à valider)

Une ou deux par famille, en reprenant les quatre déjà notés sur l'économie et les courants cités par Alexandre :

anarcho-capitalisme, marxisme, fascisme italien, social-démocratie (déjà notés), libéralisme classique, minarchisme, jacobinisme, anarcho-communisme, conservatisme libéral, néoréaction, absolutisme, écosocialisme, féminisme radical, panafricanisme, théocratie, néocaméralisme.

## À fournir par Alexandre

- [ ] Fichiers Excel des dix grilles (critères, libellés, pôles, barème économie)
- [ ] Notes économiques des quatre courants déjà évalués
- [ ] Fiches déjà rédigées de l'encyclopédie (Markdown)
- [ ] Sommaire validé des ~50 idéologies, pour le comparer au catalogue de départ
- [ ] Validation de la liste MVP
- [ ] Public prioritaire, nom public du site
