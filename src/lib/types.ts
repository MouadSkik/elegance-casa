export type CategorySlug = 'bagues' | 'boucles' | 'chaines' | 'bracelets' | 'parures';

export interface Category {
  slug: CategorySlug;
  label: string;
  sub: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAtPrice?: number;
  material: string;
  image: string | null;
  sizes?: string[];
  priceEstimated?: boolean;
  featured?: boolean;
  isNew?: boolean;
}
