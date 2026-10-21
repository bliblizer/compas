// Schémas Zod du référentiel (voir docs/modele-donnees.md).
// Source unique : utilisés par src/lib/data.ts, src/content.config.ts
// et scripts/verifier-donnees.mjs (Node importe ce fichier en retirant les types).
// Ce fichier ne doit donc importer que des paquets, jamais un autre fichier .ts local.
import { z } from 'astro/zod';

/** Identifiant kebab-case ASCII sans accents. */
export const identifiant = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'identifiant kebab-case ASCII attendu');

const couleur = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'couleur hexadécimale #RRGGBB attendue');
const note = z.number().min(0).max(10);
const sources = z.array(z.string());

// Familles — data/familles.json

export const familleSchema = z
  .object({
    id: identifiant,
    nom: z.string().min(1),
    valeurPivot: z.string().min(1),
    couleur,
    ordre: z.number().int().positive(),
    exemples: z.array(z.string()),
  })
  .strict();

export const famillesFichierSchema = z
  .object({ _note: z.string().optional(), familles: z.array(familleSchema).min(1) })
  .strict();

// Modules — data/modules.json

export const moduleSchema = z
  .object({ id: identifiant, nom: z.string().min(1), definition: z.string().min(1) })
  .strict();

export const modulesFichierSchema = z
  .object({ _note: z.string().optional(), modules: z.array(moduleSchema) })
  .strict();

// Relations — data/relations.json

export const typesRelation = ['derive', 'synthese', 'rupture', 'opposition'] as const;

export const relationSchema = z
  .object({
    source: identifiant,
    cible: identifiant,
    type: z.enum(typesRelation),
    date: z.union([z.number().int(), z.string()]).nullable(),
    note: z.string().nullable(),
    sources,
    aVerifier: z.boolean(),
  })
  .strict();

export const relationsFichierSchema = z
  .object({ _note: z.string().optional(), relations: z.array(relationSchema) })
  .strict();

// Grilles — data/grilles/<theme>.json

export const ancresSchema = z
  .object({ '0': z.string(), '2.5': z.string(), '5': z.string(), '7.5': z.string(), '10': z.string() })
  .strict();

export const critereSchema = z
  .object({
    id: identifiant,
    libelle: z.string().min(1),
    pole0: z.string().min(1),
    pole10: z.string().min(1),
    ancres: ancresSchema,
  })
  .strict();

export const grilleSchema = z
  .object({
    id: identifiant,
    nom: z.string().min(1),
    ordre: z.number().int().positive(),
    pole0: z.string().min(1),
    pole10: z.string().min(1),
    polesAValider: z.boolean(),
    orientation: z.string(),
    statut: z.string(),
    criteres: z.array(critereSchema),
  })
  .strict();

// Scores — data/scores/<courant>.json

export const valeurScoreSchema = z
  .object({
    valeur: note,
    min: note.nullable().optional(),
    max: note.nullable().optional(),
    conteste: z.boolean(),
    justification: z.string(),
    sources,
  })
  .strict();

export const scoresSchema = z
  .object({
    courant: identifiant,
    scores: z.record(
      identifiant,
      z.object({ doctrine: valeurScoreSchema.nullable(), historique: valeurScoreSchema.nullable() }).strict(),
    ),
    demo: z.boolean(),
  })
  .strict();

// Courants — frontmatter de src/content/courants/<id>.md

export const statutsRedaction = ['a_rediger', 'brouillon', 'relu', 'publie'] as const;
export const verdicts = ['vrai', 'faux', 'nuance', 'depend'] as const;

export const emergenceSchema = z
  .object({
    annee: z.number().int().nullable(),
    libelle: z.string().optional(),
    aVerifier: z.boolean(),
  })
  .strict();

export const courantSchema = z
  .object({
    id: identifiant,
    nom: z.string().min(1),
    alias: z.array(z.string()),
    famille: identifiant,
    lignees: z.array(identifiant),
    modules: z.array(identifiant),
    emergence: emergenceSchema.nullable(),
    textesReference: z.array(
      z
        .object({ titre: z.string().min(1), auteurs: z.string(), annee: z.number().int().nullable() })
        .strict(),
    ),
    figures: z.array(z.string()),
    enDialogueAvec: z.array(identifiant),
    tribunal: z.array(
      z
        .object({
          idee: z.string().min(1),
          verdict: z.enum(verdicts),
          explication: z.string(),
          sources,
        })
        .strict(),
    ),
    statut: z.enum(statutsRedaction),
    sources,
  })
  .strict();

// Données de départ — data/seed/

export const catalogueSchema = z
  .object({
    _note: z.string().optional(),
    courants: z.array(
      z
        .object({
          id: identifiant,
          nom: z.string().min(1),
          famille: identifiant,
          lignees: z.array(identifiant),
          alias: z.array(z.string()),
          emergence: emergenceSchema.nullable(),
          statut: z.enum(statutsRedaction),
        })
        .strict(),
    ),
  })
  .strict();

export const scoresDemoSchema = z
  .object({
    demo: z.literal(true),
    _note: z.string().optional(),
    grille: identifiant,
    scores: z.record(identifiant, z.array(note)),
  })
  .strict();

export const carteDemoSchema = z
  .object({
    demo: z.literal(true),
    _note: z.string().optional(),
    positions: z.array(
      z.object({ id: identifiant, x: z.number().min(0).max(100), y: z.number().min(0).max(100) }).strict(),
    ),
  })
  .strict();

export type Famille = z.infer<typeof familleSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type Relation = z.infer<typeof relationSchema>;
export type Grille = z.infer<typeof grilleSchema>;
export type Critere = z.infer<typeof critereSchema>;
export type Scores = z.infer<typeof scoresSchema>;
export type Courant = z.infer<typeof courantSchema>;
export type StatutRedaction = (typeof statutsRedaction)[number];
export type ScoresDemo = z.infer<typeof scoresDemoSchema>;
export type CarteDemo = z.infer<typeof carteDemoSchema>;
