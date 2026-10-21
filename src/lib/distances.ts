// Proximité entre courants (docs/methode.md) : distance euclidienne sur les
// critères notés en commun, normalisée par le nombre de critères comparés.

/** Nombre minimal de critères notés en commun pour publier une proximité (docs/decisions.md). */
export const SEUIL_CRITERES_COMMUNS = 5;

export type Valeurs = Record<string, number>;

export interface Proximite {
  courant: string;
  /** Racine de la moyenne des écarts au carré : 0 = identiques, 10 = opposés sur tout. */
  distance: number;
  communs: number;
}

export function distance(a: Valeurs, b: Valeurs): { distance: number; communs: number } {
  let somme = 0;
  let communs = 0;
  for (const [critere, va] of Object.entries(a)) {
    const vb = b[critere];
    if (vb === undefined) continue;
    somme += (va - vb) ** 2;
    communs++;
  }
  return { distance: communs > 0 ? Math.sqrt(somme / communs) : Infinity, communs };
}

/** Courants triés du plus proche au plus éloigné, limités à ceux qui atteignent le seuil. */
export function plusProches(
  courant: string,
  valeursParCourant: Map<string, Valeurs>,
  seuil = SEUIL_CRITERES_COMMUNS,
): Proximite[] {
  const reference = valeursParCourant.get(courant);
  if (!reference) return [];
  const proximites: Proximite[] = [];
  for (const [autre, valeurs] of valeursParCourant) {
    if (autre === courant) continue;
    const d = distance(reference, valeurs);
    if (d.communs >= seuil) proximites.push({ courant: autre, ...d });
  }
  return proximites.toSorted((x, y) => x.distance - y.distance || x.courant.localeCompare(y.courant));
}
