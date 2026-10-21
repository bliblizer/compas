// Plugin rehype des fiches de courants (src/content/courants/*.md) :
// - chaque titre de niveau 2 ouvre une <section class="fiche-section fiche-section--<titre>"> ;
// - dans « Principes fondamentaux », chaque titre de niveau 3 et ce qui le suit
//   deviennent une carte <div class="principe">, regroupées dans <div class="principes">
//   (numérotées 01, 02, 03 en CSS).
import type { Element, ElementContent, Root, RootContent } from 'hast';

const SECTION_PRINCIPES = 'principes-fondamentaux';

function texte(n: RootContent | Root): string {
  if (n.type === 'text') return n.value;
  return 'children' in n ? n.children.map(texte).join('') : '';
}

export function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function element(tagName: string, className: string[], children: ElementContent[]): Element {
  return { type: 'element', tagName, properties: { className }, children };
}

const estTitre = (n: ElementContent, niveau: string): n is Element => n.type === 'element' && n.tagName === niveau;

function regrouperPrincipes(section: Element) {
  const [titre, ...reste] = section.children;
  if (!titre || !reste.some((n) => estTitre(n, 'h3'))) return;
  const avant: ElementContent[] = [];
  const principes: Element[] = [];
  for (const n of reste) {
    if (estTitre(n, 'h3')) principes.push(element('div', ['principe'], [n]));
    else if (principes.length > 0) principes.at(-1)?.children.push(n);
    else avant.push(n);
  }
  section.children = [titre, ...avant, element('div', ['principes'], principes)];
}

export default function rehypeFiche() {
  return (arbre: Root) => {
    const enfants: RootContent[] = [];
    let section: Element | null = null;
    for (const n of arbre.children) {
      if (n.type === 'element' && n.tagName === 'h2') {
        const nom = slug(texte(n));
        section = element('section', ['fiche-section', `fiche-section--${nom}`], [n]);
        enfants.push(section);
        if (nom === SECTION_PRINCIPES) section.properties.dataPrincipes = '';
      } else if (section && n.type !== 'doctype') {
        section.children.push(n);
      } else {
        enfants.push(n);
      }
    }
    for (const n of enfants) {
      if (n.type === 'element' && n.properties.dataPrincipes !== undefined) {
        delete n.properties.dataPrincipes;
        regrouperPrincipes(n);
      }
    }
    arbre.children = enfants;
  };
}
