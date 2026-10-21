// Chargement typé du référentiel data/ (validé à chaque build).
import famillesJson from '../../data/familles.json';
import modulesJson from '../../data/modules.json';
import relationsJson from '../../data/relations.json';
import carteDemoJson from '../../data/seed/carte-demo.json';
import scoresDemoJson from '../../data/seed/scores-demo-economie.json';
import {
  carteDemoSchema,
  famillesFichierSchema,
  grilleSchema,
  modulesFichierSchema,
  relationsFichierSchema,
  scoresDemoSchema,
  scoresSchema,
  type CarteDemo,
  type Famille,
  type Grille,
  type Module,
  type Relation,
  type Scores,
  type ScoresDemo,
  type StatutRedaction,
} from './schemas';

const grillesJson = import.meta.glob<unknown>('../../data/grilles/*.json', { eager: true, import: 'default' });
const scoresJson = import.meta.glob<unknown>('../../data/scores/*.json', { eager: true, import: 'default' });

/** Familles, triées par `ordre`. */
export function getFamilles(): Famille[] {
  return famillesFichierSchema.parse(famillesJson).familles.toSorted((a, b) => a.ordre - b.ordre);
}

export function getFamille(id: string): Famille | undefined {
  return getFamilles().find((f) => f.id === id);
}

export function getModules(): Module[] {
  return modulesFichierSchema.parse(modulesJson).modules;
}

export function getRelations(): Relation[] {
  return relationsFichierSchema.parse(relationsJson).relations;
}

/** Grilles thématiques, triées par `ordre`. */
export function getGrilles(): Grille[] {
  return Object.values(grillesJson)
    .map((g) => grilleSchema.parse(g))
    .toSorted((a, b) => a.ordre - b.ordre);
}

/** Scores réels, un fichier par courant (data/scores/), indexés par courant. */
export function getScores(): Map<string, Scores> {
  return new Map(
    Object.values(scoresJson).map((s) => {
      const scores = scoresSchema.parse(s);
      return [scores.courant, scores];
    }),
  );
}

/** Positions de démonstration de la carte (data/seed/). */
export function getCarteDemo(): CarteDemo {
  return carteDemoSchema.parse(carteDemoJson);
}

/** Notes de démonstration du radar Économie (data/seed/). */
export function getScoresDemo(): ScoresDemo {
  return scoresDemoSchema.parse(scoresDemoJson);
}

export const libellesStatut: Record<StatutRedaction, string> = {
  a_rediger: 'À rédiger',
  brouillon: 'Brouillon',
  relu: 'Relu',
  publie: 'Publié',
};
