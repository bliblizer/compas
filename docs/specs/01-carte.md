# Spec 01 — Carte doctrinale (page d'accueil)

## Objectif

Montrer d'un coup d'œil l'étendue des courants et, en superposition, l'espace occupé par les partis. C'est la pièce maîtresse du site et sa page d'accueil.

## À lire avant

`docs/methode.md` (projection), `docs/design.md`, maquette « 1 · Carte doctrinale ».

## Structure de la page

1. **Introduction** : surtitre « CARTE DOCTRINALE · PROJECTION DES 10 GRILLES THÉMATIQUES », h1 « Le spectre des idées politiques est bien plus large que le débat public. », chapô expliquant que les positions découlent des notes et ne sont pas décidées à la main.
2. **Chiffres clés** : familles-racines, courants recensés, grilles thématiques, critères notés. Tous calculés depuis les données.
3. **Bloc carte**, en deux colonnes (la colonne latérale passe au-dessus sur mobile) :
   - **Panneau latéral** : carte « Sélection » (nom du courant, pastille de famille, bouton « Ouvrir la fiche ») ; filtres par famille (case à cocher, pastille, nom, nombre de courants ; boutons « Tout afficher » et « Tout masquer ») ; bloc « Affichage » (case « Superposer le champ parlementaire », choix d'axes « calculés (projection) » ou « classiques (économie × pouvoir) »).
   - **Carte** : nuage de points, un point par courant, couleur de sa famille, libellé à côté. Libellés à gauche du point près du bord droit. Titres d'axes : « Composante 1 (xx % de variance) » et « Composante 2 (xx %) » en mode calculé ; « Économie : planifié ← → marchand » et « Pouvoir : liberté ← → autorité » en mode classique.
   - **Texte de lecture** sous la carte.
4. **Trois cartes de navigation** vers Généalogie, Fiches, Candidats.

## Comportements

- Cliquer un point le sélectionne (anneau noir) et met à jour la carte « Sélection ». Le courant sélectionné est conservé dans l'URL (`?courant=<id>`).
- Décocher une famille masque ses points ; les compteurs restent visibles.
- Survol ou focus clavier d'un point : infobulle avec nom et famille.
- **Champ parlementaire** : enveloppe convexe (lissée) des positions des acteurs du scrutin de référence, en pointillés bleus, avec étiquette. Masquée et case désactivée tant qu'aucune donnée d'acteur n'existe.
- **Zoom et déplacement** (d3-zoom) avec un bouton de réinitialisation ; indispensable sur mobile.
- **Collisions de libellés** : les éviter (placement à gauche ou à droite, décalage vertical, ou masquage des libellés en dessous d'un niveau de zoom, en gardant le point).

## Données

- **Mode démo (tant que la projection n'est pas possible)** : positions de `data/seed/carte-demo.json`, bandeau « Données de démonstration », axes non titrés.
- **Mode réel** : projection ACP calculée au build (`src/lib/projection.ts`) selon `docs/methode.md`. Bascule automatique quand assez de courants et de critères sont notés (seuils dans `docs/decisions.md`). Les courants non projetables sont listés sous la carte.
- Mode « axes classiques » : moyenne de la grille Économie (x) et d'État et pouvoir (y), uniquement si ces grilles sont notées.

## Accessibilité

Points focusables au clavier, tableau des positions repliable sous la carte (courant, famille, x, y), contraste des libellés AA.

## Critères d'acceptation

- La carte affiche tous les courants disposant d'une position, colorés par famille.
- Filtres, sélection, URL et bascule d'axes fonctionnent.
- Le bandeau de démo apparaît si et seulement si les positions viennent de `data/seed/`.
- Utilisable à 375 px (zoom, panneau au-dessus).

## Questions ouvertes

- Seuils de bascule vers la projection réelle (nombre de courants, part de critères notés).
- Libellés toujours visibles ou seulement au zoom ?
