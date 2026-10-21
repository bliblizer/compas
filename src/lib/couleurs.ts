import { color, rgb } from 'd3';

function luminance(hex: string): number {
  const { r, g, b } = rgb(hex);
  const canal = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

/** Rapport de contraste WCAG d'une couleur sur fond blanc. */
export function contrasteSurBlanc(hex: string): number {
  return 1.05 / (luminance(hex) + 0.05);
}

/**
 * Fonce une couleur de famille jusqu'au contraste demandé sur fond blanc
 * (3:1 pour les éléments graphiques, WCAG 1.4.11).
 */
export function couleurLisible(hex: string, contraste = 3): string {
  let c = hex;
  for (let i = 0; i < 20 && contrasteSurBlanc(c) < contraste; i++) {
    c = color(c)?.darker(0.1).formatHex() ?? c;
  }
  return c;
}
