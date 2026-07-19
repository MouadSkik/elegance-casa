import type { Category } from '@/lib/types';

// NOTE: Your real inventory doesn't include a distinct "Coffrets" (gift box)
// line yet — what it does have is a full earrings & cuffs range ("Bagues
// d'oreille & Manchettes"), so that fills the fifth showcase slot below as
// "Boucles". If you add gift-box products later, add a `coffrets` category
// here and it'll pick up automatically (empty categories are hidden from
// the nav in CategoryNav).
export const categories: Category[] = [
  {
    slug: 'bagues',
    label: 'Bagues',
    sub: 'Rings',
    description: "Des pièces sculptées à la main, pensées pour capter la lumière sous tous les angles.",
  },
  {
    slug: 'boucles',
    label: 'Boucles',
    sub: 'Earrings & Cuffs',
    description: "Créoles, puces et manchettes — la touche finale d'une silhouette.",
  },
  {
    slug: 'chaines',
    label: 'Chaînes',
    sub: 'Necklaces & Chains',
    description: 'Des lignes fines ou audacieuses, à porter seules ou superposées — cou, main ou taille.',
  },
  {
    slug: 'bracelets',
    label: 'Bracelets',
    sub: 'Bracelets',
    description: 'Le poignet comme une signature — discret, précis, permanent.',
  },
  {
    slug: 'parures',
    label: 'Parures',
    sub: 'Sets & Gift Boxes',
    description: 'Des ensembles complets, conçus comme une seule silhouette.',
  },
];
