// Réglages du gabarit : nom, navigation, liens de pied de page.

export const nomSite = 'Compas';
export const depotGithub = 'https://github.com/bliblizer/compas';

/** Préfixe un chemin interne avec la `base` du site (/compas/). */
export function lien(chemin = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${chemin.replace(/^\//, '')}`;
}

export interface LienNavigation {
  libelle: string;
  chemin: string;
}

export const navigation: LienNavigation[] = [
  { libelle: 'Carte', chemin: '' },
  { libelle: 'Généalogie', chemin: 'genealogie/' },
  { libelle: 'Courants', chemin: 'courants/' },
  { libelle: 'Candidats', chemin: 'candidats/' },
  { libelle: 'Méthode', chemin: 'methode/' },
];

export const liensPied = [
  { libelle: 'Méthode et barèmes', href: lien('methode/') },
  { libelle: 'Critères d’inclusion', href: lien('methode/#inclusion') },
  { libelle: 'Sources', href: lien('methode/#sources') },
  { libelle: 'Signaler une erreur', href: `${depotGithub}/issues` },
];
