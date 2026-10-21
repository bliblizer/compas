# Design

## Maquettes de référence

Canvas des maquettes validées : https://claude.ai/artifact/2DqouWvE8tMKdTDZR8yXGz (accès d'Alexandre). Quatre pages : carte doctrinale, généalogie, fiche courant (écosocialisme), candidats face au spectre. Leur comportement est décrit dans `docs/specs/01` à `04`.

## Intention

Un atlas, pas un tract : clair, sobre, centré sur les données. Fond blanc, encre presque noire, un seul accent bleu pour l'interface, et des couleurs réservées aux familles d'idéologies. Aucun dégradé décoratif, aucun emoji.

## Tokens — `src/styles/tokens.css`

```css
:root {
  /* Couleurs d'interface */
  --c-fond: #FFFFFF;
  --c-fond-alt: #F5F6F8;
  --c-fond-zebre: #F7F8FA;
  --c-encre: #15171C;
  --c-texte: #2B2F36;
  --c-texte-2: #3A3F47;
  --c-texte-3: #4A5060;      /* libellés secondaires, ≥ 4.5:1 sur blanc */
  --c-bord: #DADDE3;
  --c-bord-2: #CDD1D8;
  --c-ligne: #E3E5E9;
  --c-accent: #1F3A93;
  --c-accent-hover: #132560;
  --c-accent-doux: #EDF0FA;
  --c-trait-courant: #8A909B;
  --c-verdict-fond: #FCEFD9;
  --c-verdict-texte: #7A4A00;

  /* Typographie */
  --f-titre: 'Space Grotesk', system-ui, sans-serif;
  --f-texte: 'IBM Plex Sans', system-ui, sans-serif;
  --f-mono: 'IBM Plex Mono', ui-monospace, monospace;

  /* Rayons, largeur */
  --r-s: 8px;  --r-m: 12px;  --r-pill: 999px;
  --largeur-max: 1320px;
}
```

Polices Google Fonts : Space Grotesk 500/600/700, IBM Plex Sans 400/500/600, IBM Plex Mono 400/500.

Échelle typographique des maquettes : h1 48–56 px (Space Grotesk 700, interlignage 1,05), h2 22–28 px (600), corps 15–18 px, libellés mono 12–13 px en capitales espacées (letter-spacing 0,06em).

## Couleurs des familles

Source de vérité : `data/familles.json`. Elles servent aux points de la carte, aux couloirs de la généalogie et aux pastilles de famille. Le nom de la famille est toujours écrit à côté : la couleur ne porte jamais seule l'information.

| Famille | Couleur |
|---|---|
| Libéralismes | #C9940A |
| Républicanismes | #2F6DB5 |
| Socialismes | #E07A5F |
| Marxismes | #B3263E |
| Anarchismes | #2B2B2B |
| Conservatismes | #5B4BA0 |
| Traditionalismes et réaction | #8A6A43 |
| Fascismes | #5E6B2F |
| Autoritarismes non fascistes | #8A9099 |
| Écologismes | #2E8B57 |
| Émancipations | #C2499A |
| Anticolonialismes et tiers-mondismes | #E8902A |
| Politiques religieuses | #5FA8C8 |
| Technopolitiques | #16A2A2 |

## Composants récurrents

- **En-tête** : logo (cercle et trois points de couleur) + nom, navigation Carte · Généalogie · Courants · Candidats · Méthode (lien actif sur fond `--c-accent-doux`), champ de recherche à droite. Passe à la ligne sur mobile.
- **Surtitre** mono en capitales au-dessus de chaque h1.
- **Pastille de famille** : point de couleur + nom, en pilule bordée.
- **Carte** (bloc) : bord 1 px `--c-bord`, rayon 12 px, padding 18–24 px. Pas de bordure gauche colorée.
- **Bouton principal** : fond `--c-accent`, texte blanc, hauteur ≥ 44 px. Secondaire : bordé.
- **Bandeau de démonstration** : libellé mono « Données de démonstration » sur toute vue alimentée par `data/seed/`.
- **Légendes** : traits plein, pointillé et épais pour les relations ; trait gris, bande bleue et pastille pour l'Observatoire.

## Séries comparées (radars)

Distinguer les séries par la couleur **et** le motif de trait : série principale pleine et remplie ; comparaisons en tirets (6 4), pointillés (2 3), longs tirets (10 4).

## Accessibilité

Contrastes AA (texte ≥ 4,5:1), cibles tactiles ≥ 44 px, focus visible, vrais boutons et liens, `aria-pressed` sur les bascules, tableau de données accessible sous chaque visualisation, rendu utilisable à 375 px (les grandes visualisations défilent horizontalement dans leur cadre).
