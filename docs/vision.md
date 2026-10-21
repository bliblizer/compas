# Vision

## La promesse

Compas montre l'étendue réelle du champ des idées politiques : des courants canoniques (libéralisme, marxisme, conservatisme) jusqu'aux plus marginaux (posadisme, néocaméralisme, archéofuturisme, accélérationnisme). Il les rend comparables grâce à un référentiel unique, puis superpose à cet espace les positions de l'offre politique réelle.

Le site doit être à la fois très visuel (cartes, radars, frises, statistiques partageables) et rigoureux (barèmes publiés, sources, incertitudes affichées).

## La thèse, et sa nuance

**La thèse** : l'offre politique et médiatique n'occupe qu'une petite partie de l'espace des idées.

**La nuance indispensable** : cette étroitesse a des causes en partie légitimes, que le site explique :

- les contraintes institutionnelles (Constitution, traités européens) ;
- la logique électorale, qui pousse vers l'électeur médian ;
- la nature des partis, qui sont des coalitions et non des doctrines pures ;
- le rejet de certaines idées à cause de leur bilan historique.

Présenté comme un simple verrouillage, l'écart serait lu comme militant ou complotiste. Expliqué, il devient pédagogique et bien plus convaincant. D'où une page centrale : « Pourquoi le débat est-il si resserré ? ».

## Ce qui différencie le projet

Les outils existants (Political Compass, 8values…) positionnent l'utilisateur sur deux axes ou quelques axes imposés. Aucun ne met en regard **l'espace complet des idées** et **le couloir effectivement occupé par l'offre politique**. C'est l'originalité de Compas.

Deuxième différence : les axes de la carte ne sont pas imposés. Ils sont calculés à partir des notes sur les dix grilles (projection en 2D). Le fait que le clivage gauche-droite n'explique qu'une partie de la variance est déjà un résultat en soi.

## Les modules

| Module | Rôle | Statut |
|---|---|---|
| Carte doctrinale | Pièce maîtresse : tous les courants projetés en 2D, colorés par famille | Maquetté |
| Généalogie | Graphe des filiations dans le temps, entre familles | Maquetté |
| Fiches courants | Structure fixe en cinq parties, radar, proximités | Maquetté |
| Comparateur | Superposer 2 à 4 courants sur une grille | Intégré à la fiche, page dédiée plus tard |
| Observatoire (candidats) | Positions des partis et candidats sur les mêmes grilles, couverture de l'espace | Maquetté |
| Pourquoi le débat est-il si resserré ? | Page d'explication de la thèse | À rédiger |
| Méthode | Barèmes, critères d'inclusion, sources, limites | À rédiger |
| Quiz de positionnement | Situer l'utilisateur dans l'espace | Plus tard, terrain concurrentiel |

## Le référentiel unique

Le site est traité comme un produit data : un modèle central (familles, courants, grilles, critères, scores, relations, acteurs) alimente toutes les vues. Les fiches, radars, cartes et comparaisons ne sont que des rendus de ce référentiel. Le versionnement Git des données donne un historique public des modifications de scores, ce qui sert la transparence.

## Ancrage et périmètre

L'élection présidentielle française de 2027 est le point d'ancrage naturel : un observatoire lancé avant la campagne a un argument d'actualité.

**MVP visé** :

- environ 15 courants bien choisis, couvrant toutes les familles ;
- deux grilles entièrement notées : Économie, et État et pouvoir ;
- la carte 2D, le comparateur de radars et l'observatoire avec les principaux partis français.

Les fiches complètes, la généalogie complète et les autres grilles viennent ensuite.

## Questions ouvertes

- **Public prioritaire** : grand public curieux (visuels partageables) ou public initié (étudiants, passionnés de théorie politique) ? Cela règle le ton et la profondeur des fiches.
- **Nom public** : « Compas » (nom du dépôt) ou « Atlas des idéologies » (libellé des maquettes) ?
- **Nom de domaine** propre ou URL GitHub Pages pour commencer.
