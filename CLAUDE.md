# Compas — instructions pour Claude Code

## Le projet en bref

Compas est un site web public qui cartographie l'ensemble des idéologies politiques, des plus étudiées aux plus marginales, puis les met en regard de l'offre politique réelle.

La thèse du site : l'espace des idées politiques est immense, et le débat public n'en occupe qu'une petite partie. Le site doit le **montrer par les données**, sans militantisme, et **expliquer** les causes de cet écart plutôt que de les dénoncer.

Le site a deux fonctions qui se renforcent :

- **L'Atlas** pour comprendre : carte des courants, généalogie, fiches, radars comparatifs.
- **L'Observatoire** pour confronter : positions des partis et candidats superposées à l'Atlas.

Langue du site et de la documentation : **français**. Porteur du projet : Alexandre (data analyst). La conception se fait hors de ce dépôt ; ce dépôt reçoit des specs validées à implémenter.

## Stack

- **Astro** (dernière version stable), TypeScript en mode strict, npm.
- **Fiches de courants** : Markdown avec frontmatter, content collection `courants` dans `src/content/courants/`.
- **Données structurées** : JSON dans `data/` (familles, modules, grilles, scores, relations, acteurs). Validation par schémas Zod.
- **Visualisations** : D3 v7, en TypeScript côté client, un composant Astro par visualisation. Pas de React ni de framework UI.
- **Déploiement** : GitHub Pages via l'action officielle `withastro/action`. URL : `https://bliblizer.github.io/compas/` (donc `base: '/compas'`).
- **Scripts de données** : Node (`scripts/*.mjs`) de préférence ; Python accepté pour la conversion des fichiers Excel.

## Structure du dépôt

```
CLAUDE.md                 ce fichier
docs/                     conception validée (à lire avant d'agir)
  specs/                  une spec par itération ou fonctionnalité
  decisions.md            journal des décisions techniques (à tenir à jour)
data/                     référentiel unique, source de vérité
  familles.json
  modules.json
  relations.json
  grilles/<theme>.json
  scores/<courant>.json   (à créer au fil de la notation)
  acteurs/                (partis et candidats, itération Observatoire)
  seed/                   catalogue de départ et données de démonstration
src/
  content/courants/<id>.md
  content.config.ts       schéma de la collection courants
  lib/                    chargement des données, schémas, calculs (projection, distances)
  components/             composants Astro, dont viz/ pour les visualisations
  layouts/
  pages/
  styles/tokens.css       design tokens
scripts/                  conversions et contrôles de données
```

## Documents de référence

| Document | Quand le lire |
|---|---|
| `docs/vision.md` | Toujours, une fois par session |
| `docs/taxonomie.md` | Dès qu'on touche aux familles, courants, modules ou relations |
| `docs/grilles.md` | Dès qu'on touche aux scores, radars, carte ou observatoire |
| `docs/modele-donnees.md` | Avant de créer ou modifier un fichier de `data/` ou un schéma |
| `docs/methode.md` | Pour tout calcul (projection, distances, couverture) et tout ce qui concerne les candidats |
| `docs/design.md` | Avant de créer ou modifier un composant visuel |
| `docs/roadmap.md` | Pour savoir où en est le projet |
| `docs/specs/*.md` | La spec de l'itération en cours |

## Règles de travail

1. **Une itération = une spec.** Lis la spec demandée et les documents qu'elle cite, propose un plan court, puis implémente. Si la spec contient des « Questions ouvertes » qui bloquent, pose-les avant de coder.
2. **Ne jamais inventer de données de fond** : scores, dates, citations, sources, positions de partis ou de candidats, statistiques. Utilise des emplacements visibles `[À COMPLÉTER]` ou des données de `data/seed/` marquées `"demo": true`. Toute vue qui affiche des données de démonstration affiche le bandeau « Données de démonstration ».
3. **Le référentiel `data/` est la seule source de vérité.** Les pages et visualisations lisent les données ; aucune valeur n'est codée en dur dans un composant.
4. **Consigne chaque décision technique durable** dans `docs/decisions.md` (date, décision, raison).
5. **Avant de proposer un commit**, `npm run build` doit passer sans erreur.
6. **Commits** petits et thématiques, messages en français à l'impératif (« Ajoute la page généalogie »). Ne pousse que lorsqu'Alexandre le demande.
7. **Mobile** : chaque page doit rester utilisable à 375 px de large.
8. Si une consigne de spec te paraît contradictoire avec ce fichier ou la méthode, signale-le au lieu de trancher seul.

## Règles éditoriales et de neutralité

- Ton **descriptif**, jamais prescriptif. Une idée est présentée telle que ses défenseurs la formulent, puis avec les critiques et les faits qui la discutent.
- **Même structure et même sérieux pour tous les courants**, y compris les plus extrêmes. Leur bilan historique est présenté systématiquement quand il existe, pour qu'on ne puisse pas lire une fiche comme une promotion.
- **Aucun parti ni candidat n'est noté par l'IA.** Leurs positions viennent de sources publiées (Chapel Hill Expert Survey, Manifesto Project, boussoles électorales du Cevipof…) via une table de correspondance documentée. Voir `docs/methode.md`.
- **Chaque score a une justification et une source.** Un score sans source est affiché comme provisoire.
- Le site explique l'étroitesse du débat (contraintes institutionnelles, logique électorale, partis-coalitions, bilans historiques) dans une page dédiée.

## Conventions

- **Identifiants** : kebab-case ASCII sans accents (`ecosocialisme`, `marxisme-leninisme`, `etat-pouvoir`).
- **Texte affiché** : typographie française, guillemets « », apostrophe ’, espace insécable avant `: ; ! ?`. Le code, le JSON et les identifiants restent en ASCII.
- **Scores** : échelle de 0 à 10, orientation constante par critère, définie dans la grille.
- **Accessibilité** : contrastes WCAG AA, vrais `<button>` et `<a>`, chaque visualisation est accompagnée d'un tableau de données accessible (repliable).
- **Design** : tokens dans `src/styles/tokens.css`, voir `docs/design.md`. Pas d'emoji, pas de dégradés décoratifs.

## Commandes

```
npm install
npm run dev       # site local sur http://localhost:4321/compas/
npm run build
npm run preview
```

## État actuel

Dépôt initialisé avec la documentation et les données de départ. Prochaine étape : `docs/specs/00-initialisation.md`.
