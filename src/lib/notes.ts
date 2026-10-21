// Notes des courants regroupées par grille (couche doctrine).
// Les notes réelles (data/scores/) remplacent, grille par grille, les notes de
// démonstration (data/seed/scores-demo-*.json).
import { getGrilles, getScores, getScoresDemo } from './data';

export interface NoteCritere {
  valeur: number;
  min: number | null;
  max: number | null;
  conteste: boolean;
  justification: string;
  sources: string[];
}

export interface SerieNotes {
  courant: string;
  demo: boolean;
  /** Notes indexées par identifiant de critère. */
  notes: Record<string, NoteCritere>;
}

/** grille → courant → notes. Seules les grilles ayant un barème (des critères) figurent. */
export function getNotesParGrille(): Map<string, Map<string, SerieNotes>> {
  const grilles = getGrilles().filter((g) => g.criteres.length > 0);
  const grilleDuCritere = new Map(grilles.flatMap((g) => g.criteres.map((c) => [c.id, g.id] as const)));
  const resultat = new Map(grilles.map((g) => [g.id, new Map<string, SerieNotes>()]));

  const demo = getScoresDemo();
  const grilleDemo = grilles.find((g) => g.id === demo.grille);
  if (grilleDemo) {
    for (const [courant, valeurs] of Object.entries(demo.scores)) {
      const notes: Record<string, NoteCritere> = {};
      grilleDemo.criteres.forEach((c, i) => {
        const valeur = valeurs[i];
        if (valeur === undefined) return;
        notes[c.id] = { valeur, min: null, max: null, conteste: false, justification: '', sources: [] };
      });
      resultat.get(grilleDemo.id)?.set(courant, { courant, demo: true, notes });
    }
  }

  for (const scores of getScores().values()) {
    const parGrille = new Map<string, Record<string, NoteCritere>>();
    for (const [critere, couches] of Object.entries(scores.scores)) {
      const grille = grilleDuCritere.get(critere);
      const doctrine = couches.doctrine;
      if (!grille || !doctrine) continue;
      const notes = parGrille.get(grille) ?? {};
      notes[critere] = {
        valeur: doctrine.valeur,
        min: doctrine.min ?? null,
        max: doctrine.max ?? null,
        conteste: doctrine.conteste,
        justification: doctrine.justification,
        sources: doctrine.sources,
      };
      parGrille.set(grille, notes);
    }
    for (const [grille, notes] of parGrille) {
      resultat.get(grille)?.set(scores.courant, { courant: scores.courant, demo: scores.demo, notes });
    }
  }

  return resultat;
}
