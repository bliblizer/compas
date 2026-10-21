# Spec 05 — Import du référentiel Excel

## Objectif

Permettre à Alexandre de saisir les données structurées dans un classeur Excel, puis de les importer d'une commande dans le référentiel du site.

## Décision de fond

- **`data/source/compas-referentiel.xlsx` fait foi** pour toutes les données structurées : courants (identité, frontmatter), tribunal, relations, thématiques, critères, scores.
- Les fichiers JSON de `data/` (hors `data/seed/` et `data/acteurs/`) deviennent des **fichiers générés** : ne plus les modifier à la main.
- **Le texte rédigé des fiches** (corps Markdown : définition, principes, mises en œuvre historiques) reste écrit directement dans `src/content/courants/<id>.md`. L'import ne touche **jamais** au corps des fiches.
- Consigner cette décision dans `docs/decisions.md` et l'indiquer dans `CLAUDE.md`.

## Le classeur

Onglets : `Lisez-moi`, `Courants`, `Tribunal`, `Relations`, `Thematiques`, `Criteres`, `Scores`, `Matrice_Economie` (vue de contrôle, ignorée par l'import), `Listes` (valeurs autorisées).

Conventions : identifiants kebab-case ; valeurs multiples séparées par « ; » ; textes de référence au format `Titre (Auteurs, année)` ; cellules vides = valeur absente ; les colonnes calculées (`theme`, `controle`) sont ignorées.

## Le script — `npm run import:excel`

1. Lit le classeur (bibliothèque Node au choix, par exemple `exceljs` ; consigner le choix). Lire les **valeurs** des cellules, pas les formules.
2. Valide chaque ligne avec les schémas Zod existants, et vérifie les références croisées : familles, lignées, modules, courants cités dans Tribunal, Relations, Scores et `en_dialogue_avec`, critères cités dans Scores, notes entre 0 et 10, min ≤ valeur ≤ max.
3. En cas d'erreur : n'écrit **rien** et affiche un rapport lisible, une ligne par problème, avec l'onglet, le numéro de ligne Excel et la colonne (`Scores, ligne 14, colonne valeur : 12 est hors de l'échelle 0-10`).
4. Sinon, génère :
   - `data/relations.json`, `data/grilles/<theme>.json` (thématique + critères + ancres), `data/scores/<courant>.json` (un fichier par courant ayant au moins une note) ;
   - le **frontmatter** de chaque `src/content/courants/<id>.md` (crée la fiche si elle n'existe pas, avec les titres fixes du corps) en conservant le corps à l'identique ;
   - le champ `tribunal` du frontmatter depuis l'onglet Tribunal.
5. Affiche un résumé : courants créés ou mis à jour, nombre de notes par thématique, avertissements (scores sans source, dates à vérifier).
6. Option `--dry-run` : valide et affiche le résumé sans rien écrire.

Ensuite, `npm run check:data` et `npm run build` doivent passer.

## Données de démonstration

Dès qu'un courant a des notes réelles sur une thématique, ses notes de démonstration de `data/seed/` ne sont plus utilisées pour cette thématique. Quand toutes les notes économiques de démo sont remplacées, retirer `scores-demo-economie.json` (après validation d'Alexandre).

## Critères d'acceptation

- Le classeur livré, importé tel quel, ne casse rien : mêmes courants et relations qu'aujourd'hui, corps des fiches inchangé (vérifier avec `git diff`).
- Une note hors échelle, un identifiant inconnu ou une famille inexistante produisent un rapport d'erreur clair et aucun fichier modifié.
- La fiche Écosocialisme garde son texte ; son frontmatter correspond à l'onglet Courants et Tribunal.

## Hors périmètre

Export inverse JSON → Excel ; données d'acteurs (Observatoire).
