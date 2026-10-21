# Maquettes de référence

Ces fichiers sont le code source des maquettes validées (canvas : https://claude.ai/artifact/2DqouWvE8tMKdTDZR8yXGz).

**Ils ne s'exécutent pas tels quels** : ils dépendent du moteur de l'outil de maquettage (`support.js`, balises `<x-dc>`, `<sc-for>`, `<sc-if>`, gabarits `{{…}}`). Ils servent de **référence** pour l'implémentation :

- la mise en page, les textes et les styles (valeurs exactes des couleurs, tailles, espacements) ;
- la logique de calcul dans le bloc `<script type="text/x-dc">` en bas de chaque fichier (méthode `renderVals()`).

| Fichier | Page | Logique utile |
|---|---|---|
| `carte.dc.html` | Carte doctrinale | Placement des points (marge de 4 %, libellés à gauche au-delà de x = 85), filtres par famille, sélection, bascule d'axes |
| `genealogie.dc.html` | Généalogie | Échelle du temps 1760 → 2040, couloirs de 72 px, trois sous-lignes (−22, 0, +22 px), liens en courbes de Bézier dans un SVG `preserveAspectRatio="none"` avec `vector-effect="non-scaling-stroke"`, mise en évidence d'une lignée |
| `fiche.dc.html` | Fiche courant | Radar à 7 axes : centre (220, 200), rayon 120, angle `-π/2 + i·2π/n`, anneaux à 2, 4, 6, 8, 10, positions des libellés, séries superposées avec motifs de trait |
| `candidats.dc.html` | Observatoire | Lignes par grille, traits des courants, bande d'étendue des candidats, mise en avant d'un candidat |

À l'implémentation, on **réécrit** ces visualisations en D3 et en composants Astro, en lisant les données de `data/` : aucune valeur ne doit être recopiée en dur depuis les maquettes. Les positions et notes qu'elles contiennent sont des données de démonstration, déjà disponibles dans `data/seed/`.
