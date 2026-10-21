# Rédiger une fiche

Le texte d'une fiche s'écrit dans `src/content/courants/<id>.md`, sous l'en-tête (le bloc entre `---`), qui est généré depuis le classeur Excel : n'y touche pas à la main. Modèle complet : `ecosocialisme.md`.

## Structure du corps

```markdown
## Définition

Un paragraphe de deux à quatre phrases : ce que le courant affirme, et ce qui le distingue de ses voisins.

## Principes fondamentaux

### Titre court du principe 1

Une à trois phrases.

### Titre court du principe 2

…

## Mises en œuvre historiques

(Optionnel.) Les régimes, mouvements ou expériences qui s'en réclament, et leur bilan, sourcés.
```

Trois à cinq principes. La carte d'identité, l'arbre généalogique et le tribunal des idées reçues sont générés automatiquement : ils ne s'écrivent pas ici.

## Règles de rédaction

- Ton neutre et descriptif : le courant tel que ses défenseurs le formulent, sans adhésion ni dénonciation.
- Pas de listes imbriquées.
- Même niveau d'exigence pour tous les courants, y compris extrêmes ; le bilan historique figure quand il existe.
- Toute affirmation factuelle (date, chiffre, citation) a une source dans le champ `sources` (onglet Courants).
- Typographie française : guillemets « », apostrophe ’, espace insécable avant « : ; ! ? ».

## Quand la fiche est prête

Passe son statut à `relu` dans l'onglet Courants, puis relance l'import.
