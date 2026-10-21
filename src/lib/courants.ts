import { getCollection } from 'astro:content';
import { getRelations } from './data';
import type { Courant } from './schemas';

/** Frontmatter de toutes les fiches, indexé par identifiant. */
export async function getCourants(): Promise<Map<string, Courant>> {
  return new Map((await getCollection('courants')).map((c) => [c.data.id, c.data]));
}

/** Liens d'un courant dans data/relations.json, groupés pour la fiche. */
export interface LiensCourant {
  deriveDe: string[];
  syntheseAvec: string[];
  ruptureAvec: string[];
  descendants: string[];
  rompentAvecLui: string[];
  oppositions: string[];
}

export function liensDe(id: string): LiensCourant {
  const relations = getRelations();
  const cibles = (type: string) => relations.filter((r) => r.cible === id && r.type === type).map((r) => r.source);
  const sources = (...types: string[]) =>
    relations.filter((r) => r.source === id && types.includes(r.type)).map((r) => r.cible);
  return {
    deriveDe: cibles('derive'),
    syntheseAvec: cibles('synthese'),
    ruptureAvec: cibles('rupture'),
    descendants: [...new Set(sources('derive', 'synthese'))],
    rompentAvecLui: sources('rupture'),
    oppositions: [
      ...new Set(
        relations
          .filter((r) => r.type === 'opposition' && (r.source === id || r.cible === id))
          .map((r) => (r.source === id ? r.cible : r.source)),
      ),
    ],
  };
}
