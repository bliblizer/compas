# Spec 04 — Candidats face au spectre (Observatoire)

## Objectif

Rendre visible, grille par grille, la part de l'espace des idées réellement occupée par les candidats d'un scrutin. C'est le module qui porte la thèse du site : il doit être irréprochable sur la méthode.

## À lire avant

`docs/methode.md` (placement des acteurs, statistiques), `docs/grilles.md`, maquette « 4 · Candidats face au spectre ».

## Règle absolue

Aucune position de parti ou de candidat n'est saisie ou estimée par l'IA. Tant que les données réelles (Chapel Hill, Manifesto Project, Cevipof, via `data/acteurs/correspondances.json`) ne sont pas importées, la page affiche des **candidats anonymes de démonstration** (A, B, C, D) avec le bandeau « Données de démonstration ». Aucun nom réel n'est associé à une position inventée.

## Structure de la page

1. **Introduction** : surtitre « CANDIDATS FACE AU SPECTRE », h1 « Les candidats occupent-ils tout l'espace des idées ? », chapô expliquant la lecture (traits gris = courants, pastilles = candidats, même barème).
2. **Barre d'outils** : sélecteur de scrutin ; pastilles de candidats (« Tous les candidats », puis un bouton par candidat avec sa couleur) pour en mettre un en avant.
3. **Tableau de bandes**, une ligne par grille notée :
   - à gauche : nom de la grille et sa couverture (« Couverture : xx % ») ;
   - à droite : une échelle de 0 à 10 avec ses deux pôles écrits dessous ; un trait gris vertical par courant noté ; une bande bleue claire de l'étendue couverte par les candidats ; une pastille par candidat (lettre ou initiales, couleur du candidat).
   - Légende en tête du tableau.
   - Option : basculer de « une ligne par grille » (moyenne de la grille) à « une ligne par critère » pour une grille donnée.
4. **Chiffres de synthèse** : espace couvert (moyenne des couvertures), nombre de courants orphelins.
5. **Encadré méthode** : comment les candidats sont placés, sources, lien vers la page Méthode.

## Comportements

- Mettre un candidat en avant atténue les autres pastilles (opacité réduite) ; état conservé dans l'URL.
- Survol ou focus d'un trait gris : nom du courant ; d'une pastille : candidat, valeur, source.
- Les grilles sans barème ne figurent pas dans le tableau (mention « x grilles non encore notées »).
- Les candidats se distinguent par la couleur **et** par leur étiquette.

## Données

- Courants : `data/scores/` agrégés par grille selon `docs/methode.md`.
- Acteurs : `data/acteurs/` (structure dans `docs/modele-donnees.md`).
- Démo : quatre acteurs anonymes générés de façon déterministe, clairement marqués `demo`.
- Statistiques calculées au build dans `src/lib/observatoire.ts`.

## Accessibilité

Tableau de données accessible (grille, candidat, valeur, source), boutons `aria-pressed`, contraste AA, étiquettes lisibles sur chaque couleur de pastille.

## Critères d'acceptation

- En mode démo : bandeau visible, aucun nom réel, statistiques remplacées par `[xx %]` et `[N]`.
- En mode réel : chaque pastille renvoie à sa source ; statistiques conformes aux définitions de la méthode.
- Utilisable à 375 px (les lignes passent sur deux niveaux : libellé puis échelle).

## Questions ouvertes

- Scrutin de référence pour le lancement (présidentielle 2027 : liste des candidats selon le calendrier officiel).
- Partis ou candidats ? (Les jeux de données externes positionnent surtout des partis.)
- Seuil de distance définissant un courant orphelin.
