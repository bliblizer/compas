# Spec 02 — Généalogie des courants

## Objectif

Montrer d'où viennent les idées : une frise chronologique où chaque famille a son couloir, et où les liens de filiation traversent les familles.

## À lire avant

`docs/taxonomie.md` (relations), `docs/design.md`, maquette « 2 · Généalogie des courants ».

## Structure de la page

1. **Introduction** : surtitre « GÉNÉALOGIE · 1760 – AUJOURD'HUI », h1 « D'où viennent les idées ? », chapô.
2. **Barre d'outils** : sélecteur de période (1760 – aujourd'hui, XIXe siècle, XXe siècle, depuis 1945), légende des types de liens, mention « Dates : texte ou mouvement fondateur, à sourcer par fiche ».
3. **Frise** dans un cadre à défilement horizontal :
   - colonne de gauche fixe : les 14 familles (pastille + nom), une ligne par famille, fond zébré ;
   - axe du temps en haut, graduations tous les 25 ans, lignes verticales légères ;
   - un nœud par courant daté, en pilule bordée de la couleur de sa famille, avec son nom et son année ;
   - liens en courbes de Bézier entre nœuds : trait plein (`derive`), pointillé (`synthese`).
4. **Panneau « Lignée sélectionnée »** : nom, phrase décrivant ses parents et courants en dialogue (générée depuis les relations), boutons « Ouvrir la fiche » et « Voir sur la carte ».
5. **Encadré « Types de relations »**.

## Comportements

- Cliquer un nœud le sélectionne : nœud plein bleu, parents bordés en bleu épais, liens vers lui en bleu épais ; le reste s'atténue légèrement. Sélection dans l'URL (`?courant=<id>`).
- Le sélecteur de période recadre l'axe du temps.
- **Placement vertical anti-collision** : dans chaque couloir, répartir les nœuds sur trois sous-lignes (haut, milieu, bas) pour éviter les chevauchements de pilules, par un algorithme simple et déterministe.
- Les courants sans date ne figurent pas dans la frise : ils sont listés sous elle, par famille.

## Données

- Nœuds : collection `courants`, champ `emergence.annee`.
- Liens : `data/relations.json`, types `derive` et `synthese` (les `opposition` ne sont pas tracés).
- Toutes les dates du catalogue sont des repères **à vérifier** (`aVerifier: true`) : afficher un indicateur discret sur les nœuds concernés tant que la date n'est pas sourcée.

## Accessibilité

Nœuds focusables, liste textuelle accessible de la généalogie (par famille : courant, année, parents) en alternative à la frise.

## Critères d'acceptation

- Tous les courants datés apparaissent dans le bon couloir, à la bonne année, sans chevauchement de pilules dans un même couloir.
- Les liens correspondent exactement à `relations.json`.
- La sélection met en évidence la lignée et met à jour le panneau.
- Défilement horizontal fluide sur mobile.

## Questions ouvertes

- Rendu des relations de type `rupture`.
- Afficher aussi les variantes et incarnations plus tard ?
