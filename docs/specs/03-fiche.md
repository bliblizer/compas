# Spec 03 — Fiche courant et index des courants

## Objectif

Une page par courant, avec la structure fixe en cinq parties de l'encyclopédie, enrichie d'un radar par grille et de ses proximités. C'est la page de référence vers laquelle mènent la carte, la généalogie et l'Observatoire.

## À lire avant

`docs/modele-donnees.md` (frontmatter), `docs/grilles.md`, `docs/design.md`, maquette « 3 · Fiche courant — Écosocialisme ».

## Index — `/courants/`

Courants groupés par famille (ordre de `familles.json`), chaque famille avec sa couleur, sa valeur pivot et ses courants (nom + statut de rédaction). Filtre texte simple.

## Fiche — `/courants/[id]/`

Mise en page en deux colonnes ; la colonne latérale passe sous l'article sur mobile.

### Colonne principale

1. **Fil d'Ariane** : Atlas / Famille / Courant.
2. **Titre** et **pastilles** : « Famille : … », puis « Lignée secondaire : … » pour chaque lignée, puis les modules.
3. **Carte d'identité** (grille de cases) : émergence, texte de référence, figures, parents (depuis les relations), en dialogue avec, modules.
4. **Définition** (corps Markdown).
5. **Principes fondamentaux** (corps Markdown ; rendu en cartes numérotées 01, 02, 03 si les principes sont des sous-titres de niveau 3).
6. **Arbre généalogique** : parents (« Dérive de », « Synthèse avec ») → courant → courants en dialogue ou descendants, généré depuis `relations.json` ; lien « Voir dans la frise complète ».
7. **Tribunal des idées reçues** : une carte par entrée du frontmatter `tribunal`, avec l'idée entre guillemets, le verdict en pastille (vrai, faux, nuancé, ça dépend) et l'explication.

### Colonne latérale

1. **Profil par grille** :
   - onglets des dix thématiques (boutons `aria-pressed`) ;
   - si la grille a un barème et des notes pour ce courant : radar D3 (un axe par critère, anneaux à 2, 4, 6, 8, 10, libellés des critères), série du courant pleine et remplie ;
   - sinon : encadré « Barème à établir » ou « Pas encore noté sur cette grille » ;
   - mention du barème (« 10 = pôle marchand sur chaque critère » pour l'économie) ;
   - **Superposer** : jusqu'à trois autres courants, choisis dans une liste (par défaut, les courants proches), chacun avec un motif de trait distinct ;
   - fourchettes affichées en zone ombrée quand elles existent ; notes contestées signalées.
2. **Courants les plus proches** : les trois plus proches selon `docs/methode.md`, avec leur distance ; « [distance] » tant que le calcul n'est pas possible.
3. Bouton « Comparer avec les candidats ».

## États de rédaction

`statut: a_rediger` affiche les sections en `[À COMPLÉTER]` et un bandeau « Fiche en cours de rédaction ». Les données de démo (`scores-demo-economie.json`) déclenchent le bandeau « Données de démonstration » sur le radar.

## Accessibilité

Tableau des notes sous le radar (critère, valeur, fourchette, source), onglets et bascules au clavier.

## Critères d'acceptation

- Une page générée par fichier de la collection, y compris les fiches vides.
- La fiche Écosocialisme (`src/content/courants/ecosocialisme.md`, déjà fournie avec le contenu de la maquette, `statut: brouillon`) reproduit la maquette.
- Le radar Économie affiche les données de démo avec bandeau ; les autres onglets affichent « Barème à établir ».
- Les arbres généalogiques correspondent à `relations.json`.

## Questions ouvertes

- Ajouter une section optionnelle « Mises en œuvre historiques » (bilan des régimes qui s'en réclament) à la structure en cinq parties, ou l'intégrer au tribunal ?
- Afficher la position du courant sur une mini-carte dans la fiche ?
