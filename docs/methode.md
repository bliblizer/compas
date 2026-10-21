# Méthode

Ce document fixe les règles de rigueur du projet. Une version grand public sera publiée sur la page Méthode du site.

## Notation des courants

1. Chaque critère a un **barème publié** (ancres 0, 2,5, 5, 7,5, 10).
2. Chaque note a une **justification** et au moins une **source**. Sans source, elle est affichée comme provisoire.
3. Quand un courant est ambigu sur un critère, on donne une **fourchette**, et on signale les notes **contestées**.
4. On distingue la couche **doctrine** (le courant tel qu'il se pense) de la couche **historique** (ce qu'en ont fait les régimes qui s'en réclament), quand elle existe.
5. Les notes sont versionnées : l'historique Git sert de journal public des modifications.

## Les principaux pièges

- **La subjectivité des scores** est le point faible de tous les projets de ce type. Barèmes publiés, fourchettes et sources sont la réponse.
- **Doctrine et pratique** divergent souvent : d'où les deux couches.
- **Idéologie et acteur ne sont pas de même nature** : une idéologie est un idéal-type, un parti est un programme sous contraintes. On ne les note pas de la même façon (voir plus bas).
- **Les idéologies extrêmes** sont présentées de façon factuelle, avec la même structure que les autres et leur bilan historique quand il existe.

## Calculs

### Projection de la carte

- Entrée : la matrice courants × critères, limitée aux critères notés pour une part suffisante des courants (seuil à définir dans `decisions.md`).
- Standardisation de chaque critère, puis **analyse en composantes principales** ; on garde les deux premières composantes.
- La carte affiche la **part de variance expliquée** par chaque axe.
- Les valeurs manquantes sont exclues ou imputées selon une règle documentée ; un courant avec trop de notes manquantes n'apparaît pas sur la carte (il est listé à part).
- Mode alternatif « axes classiques » : x = moyenne de la grille Économie, y = moyenne de la grille État et pouvoir.
- UMAP pourra être testé plus tard ; l'ACP reste la référence car ses axes s'interprètent.

### Proximité entre courants

Distance euclidienne sur les critères notés en commun, normalisée par le nombre de critères comparés. On n'affiche une proximité que si le nombre de critères communs dépasse un seuil.

### Statistiques de l'Observatoire

- **Couverture par grille** : étendue (max − min) des positions des acteurs divisée par l'étendue des positions des courants.
- **Couverture globale de la carte** : surface de l'enveloppe convexe des acteurs rapportée à celle des courants.
- **Courants orphelins** : courants dont la distance au plus proche acteur dépasse un seuil documenté.

Le message « l'offre électorale couvre X % de l'espace des idées » est très partageable : il n'est publié que si le calcul et ses limites sont expliqués juste à côté.

## Placement des partis et candidats

- L'IA ne note **jamais** un parti ou un candidat.
- On s'appuie sur des données existantes et reconnues :
  - **Chapel Hill Expert Survey** (positions des partis européens par enquête d'experts) ;
  - **Manifesto Project** (codage des programmes électoraux) ;
  - **boussoles électorales du Cevipof** pour la France ;
  - V-Party pour une vue mondiale, si besoin.
- Leurs critères ne correspondent pas exactement à ceux de Compas : une **table de correspondance** documentée (`data/acteurs/correspondances.json`) convertit chaque mesure externe vers un critère Compas, avec la règle de conversion.
- Chaque position affichée renvoie à sa source et, quand c'est possible, à l'extrait de programme.
- Tant que les données réelles ne sont pas importées, l'Observatoire n'affiche que des acteurs **anonymes** de démonstration (A, B, C, D). Aucun nom réel n'est associé à une position inventée.

## Critère d'inclusion et exhaustivité

Voir `taxonomie.md` : corpus identifiable, penseur ou texte de référence, désignation stable ; exhaustivité visée par saturation des sources.

## Page « Pourquoi le débat est-il si resserré ? »

Plan proposé, à rédiger :

1. Le constat, chiffré par l'Observatoire.
2. Les contraintes institutionnelles (Constitution, traités, engagements internationaux).
3. La logique électorale et l'électeur médian.
4. Les partis comme coalitions.
5. Le rejet de certaines idées à cause de leur bilan historique.
6. Ce que l'écart dit, et ce qu'il ne dit pas.

## Limites à publier

Les notes restent des interprétations. Les grilles reflètent des choix de critères. La projection 2D écrase de l'information. Les correspondances avec les jeux de données externes sont approximatives. Le site le dit clairement.
