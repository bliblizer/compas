// Radar D3 réutilisable (fiche courant, comparateur).
// Géométrie reprise de docs/maquettes/fiche.dc.html : cadre 440 × 400,
// centre (220, 200), rayon 120, premier axe vers le haut, anneaux à 2, 4, 6, 8, 10.
import { select } from 'd3';

export const LARGEUR = 440;
export const HAUTEUR = 400;
const CX = 220;
const CY = 200;
const RAYON = 120;
const RAYON_LIBELLES = 136;
const ANNEAUX = [2, 4, 6, 8, 10];
const MAX = 10;

/** Motifs de trait des séries comparées, dans l'ordre d'attribution (docs/design.md). */
export const MOTIFS_COMPARAISON = ['6 4', '2 3', '10 4'] as const;

export interface AxeRadar {
  id: string;
  libelle: string;
  conteste?: boolean;
}

export interface SerieRadar {
  id: string;
  nom: string;
  couleur: string;
  /** Une valeur par axe, dans l'ordre des axes ; null si le critère n'est pas noté. */
  valeurs: (number | null)[];
  /** Fourchettes par axe (série principale) ; affichées en zone ombrée. */
  min?: (number | null)[];
  max?: (number | null)[];
  /** Série principale : trait plein et remplie. Sinon, motif de trait. */
  principale?: boolean;
  motif?: string;
}

export interface ConfigRadar {
  titre: string;
  axes: AxeRadar[];
  series: SerieRadar[];
}

const angle = (i: number, n: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

function point(i: number, n: number, valeur: number, rayon = RAYON): [number, number] {
  const a = angle(i, n);
  const r = (rayon * valeur) / MAX;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

function contour(valeurs: (number | null)[], n: number): string {
  const points = valeurs.flatMap((v, i) => (v === null ? [] : [point(i, n, v)]));
  return points.length > 0 ? `M${points.map((p) => p.map((c) => c.toFixed(1)).join(',')).join('L')}Z` : '';
}

/** Ancrage d'un libellé selon la position de son axe (gauche, droite, haut, bas). */
function ancrage(i: number, n: number) {
  const a = angle(i, n);
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return {
    textAnchor: Math.abs(cos) < 0.1 ? 'middle' : cos > 0 ? 'start' : 'end',
    baseline: sin < -0.5 ? 'auto' : sin > 0.5 ? 'hanging' : 'middle',
  };
}

export interface Radar {
  maj(series: SerieRadar[]): void;
}

export function creerRadar(conteneur: HTMLElement, config: ConfigRadar): Radar {
  const { axes } = config;
  const n = axes.length;

  const svg = select(conteneur)
    .append('svg')
    .attr('viewBox', `0 0 ${LARGEUR} ${HAUTEUR}`)
    .attr('role', 'img')
    .attr('aria-label', config.titre)
    .attr('class', 'radar__svg');

  const fond = svg.append('g').attr('class', 'radar__fond');
  fond
    .selectAll('path')
    .data(ANNEAUX)
    .join('path')
    .attr('d', (v) => contour(axes.map(() => v), n))
    .attr('fill', 'none')
    .attr('stroke', (v) => (v === MAX ? 'var(--c-bord-2)' : 'var(--c-ligne)'));
  fond
    .selectAll('line')
    .data(axes)
    .join('line')
    .attr('x1', CX)
    .attr('y1', CY)
    .attr('x2', (_, i) => point(i, n, MAX)[0])
    .attr('y2', (_, i) => point(i, n, MAX)[1])
    .attr('stroke', 'var(--c-ligne)');

  svg
    .append('g')
    .attr('class', 'radar__libelles')
    .selectAll('text')
    .data(axes)
    .join('text')
    .attr('x', (_, i) => point(i, n, MAX, RAYON_LIBELLES)[0])
    .attr('y', (_, i) => point(i, n, MAX, RAYON_LIBELLES)[1])
    .attr('text-anchor', (_, i) => ancrage(i, n).textAnchor)
    .attr('dominant-baseline', (_, i) => ancrage(i, n).baseline)
    .text((a) => (a.conteste ? `${a.libelle} *` : a.libelle));

  const calqueFourchettes = svg.append('g').attr('class', 'radar__fourchettes');
  const calqueSeries = svg.append('g').attr('class', 'radar__series');

  function maj(series: SerieRadar[]) {
    // Comparaisons d'abord, série principale au-dessus.
    const ordonnees = series.toSorted((a, b) => Number(a.principale ?? false) - Number(b.principale ?? false));

    const avecFourchette = ordonnees.filter((s) => s.principale && (s.min?.some((v) => v !== null) || s.max?.some((v) => v !== null)));
    calqueFourchettes
      .selectAll<SVGPathElement, SerieRadar>('path')
      .data(avecFourchette, (s) => s.id)
      .join('path')
      .attr('d', (s) => {
        const haut = s.valeurs.map((v, i) => s.max?.[i] ?? v);
        const bas = s.valeurs.map((v, i) => s.min?.[i] ?? v);
        return `${contour(haut, n)}${contour(bas, n)}`;
      })
      .attr('fill', (s) => s.couleur)
      .attr('fill-opacity', 0.12)
      .attr('fill-rule', 'evenodd')
      .attr('stroke', 'none');

    calqueSeries
      .selectAll<SVGPathElement, SerieRadar>('path')
      .data(ordonnees, (s) => s.id)
      .join('path')
      .attr('d', (s) => contour(s.valeurs, n))
      .attr('stroke', (s) => s.couleur)
      .attr('stroke-width', (s) => (s.principale ? 2.5 : 2))
      .attr('stroke-dasharray', (s) => (s.principale ? null : (s.motif ?? MOTIFS_COMPARAISON[0])))
      .attr('fill', (s) => (s.principale ? s.couleur : 'none'))
      .attr('fill-opacity', (s) => (s.principale ? 0.18 : null))
      .each(function (s) {
        select(this).selectAll('title').data([s.nom]).join('title').text((t) => t);
      });
  }

  maj(config.series);
  return { maj };
}
