# Grilles thématiques et barèmes

## Principe

Alexandre a construit **une grille universelle** (et non des grilles modulaires par famille) : tous les courants sont évalués sur les mêmes critères, ce qui rend la comparaison possible. Les critères sont regroupés en **dix thématiques**. Chaque critère est noté de 0 à 10, avec une **orientation constante** fixée par la grille.

Les grilles existent aujourd'hui dans des fichiers Excel. Elles doivent être converties en JSON dans `data/grilles/` (une thématique par fichier).

## Les dix thématiques

Les pôles indiqués sont des **propositions de maquette** (`polesAValider: true`) à confirmer avec les grilles Excel.

| Id | Thématique | Pôle 0 (proposé) | Pôle 10 (proposé) | Statut |
|---|---|---|---|---|
| `economie` | Économie | Planifié | Marchand | Orientation fixée, barème établi dans l'Excel |
| `etat-pouvoir` | État et pouvoir | Sans État | État total | Barème à établir |
| `individu-societe` | Individu et société | Primauté du collectif | Primauté de l'individu | Barème à établir |
| `temps-changement` | Temps et changement | Restauration | Rupture | Barème à établir |
| `nation-identite` | Nation et identité | Universalisme | Primauté nationale | Barème à établir |
| `epistemologie` | Épistémologie | Tradition, révélation | Raison critique | Barème à établir |
| `ecologie` | Écologie | Productivisme | Primauté du vivant | Barème à établir |
| `violence` | Violence | Non-violence | Violence légitimée | Barème à établir |
| `religion-morale` | Religion et morale | Sécularisme | Norme religieuse | Barème à établir |
| `genre-famille-moeurs` | Genre, famille, mœurs | Ordre traditionnel | Égalité, libre choix | Barème à établir |

## L'économie, seule grille déjà convertie en barème

- **7 critères**, notés de 0 à 10, avec **10 = pôle marchand sur chaque critère**.
- Quatre courants sont déjà notés dans l'Excel : **anarcho-capitalisme, marxisme, fascisme, social-démocratie**. Un radar Excel natif les superpose.
- Les libellés des 7 critères et les notes sont dans l'Excel. Dans `data/grilles/economie.json`, les critères portent des **libellés provisoires de maquette** (Propriété, Marché, Redistribution, Planification, Commerce extérieur, Travail, Monnaie et finance) marqués `[À COMPLÉTER]`.

## Structure d'un critère

Chaque critère publie son barème sous forme d'**ancres** : ce que signifie une note de 0, 2,5, 5, 7,5 et 10. Sans barème publié, les notes ne sont pas défendables.

## Structure d'un score

Pour chaque couple courant × critère :

- une **valeur** de 0 à 10 ;
- une **fourchette** (min, max) plutôt qu'un point unique quand le courant est ambigu ;
- une **justification** courte et au moins une **source** ;
- un drapeau **contesté** quand la notation fait débat (exemple typique : le fascisme sur l'économie, où corporatisme, dirigisme et propriété privée coexistent) ;
- une **couche** : `doctrine` (le courant tel qu'il se pense) et, quand elle existe, `historique` (ce qu'en ont fait les régimes qui s'en réclament). Le communisme théorique et les régimes communistes ne se notent pas pareil : afficher les deux couches est une fonctionnalité en soi.

## Règles de visualisation

- Un radar devient illisible au-delà de 7 ou 8 axes : **un radar par thématique**, jamais un radar global à 60 axes.
- Un radar de synthèse est possible plus tard sur des **macro-axes agrégés** (une valeur par thématique), à condition de documenter l'agrégation.
- Toute thématique sans barème affiche « Barème à établir » au lieu d'un graphique vide.

## Données de démonstration

`data/seed/scores-demo-economie.json` contient les valeurs **dessinées pour la maquette** du radar (écosocialisme, social-démocratie, marxisme-léninisme, néolibéralisme). Elles ne viennent pas de l'Excel et doivent disparaître dès l'import des vraies notes.

## À compléter par Alexandre

- Les fichiers Excel des dix grilles (critères, libellés, pôles).
- Les notes économiques des quatre courants déjà évalués.
- L'ordre de priorité des barèmes à établir (le MVP demande État et pouvoir en second).
