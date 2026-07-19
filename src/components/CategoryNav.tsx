'use client';

import { motion } from 'framer-motion';
import type { Category, CategorySlug } from '@/lib/types';

interface Props {
  categories: Category[];
  active: CategorySlug | 'tout';
  onChange: (slug: CategorySlug | 'tout') => void;
}

export function CategoryNav({ categories, active, onChange }: Props) {
  const items: { slug: CategorySlug | 'tout'; label: string; sub: string }[] = [
    { slug: 'tout', label: 'Tout', sub: 'All' },
    ...categories.map((c) => ({ slug: c.slug, label: c.label, sub: c.sub })),
  ];

  return (
    <nav
      aria-label="Filtrer par catégorie"
      className="sticky top-[73px] z-30 border-b rule bg-linen/95 backdrop-blur-md"
    >
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 py-3 md:justify-center md:gap-2">
        {items.map((item) => {
          const isActive = active === item.slug;
          return (
            <li key={item.slug} className="shrink-0">
              <button
                onClick={() => onChange(item.slug)}
                className="relative px-4 py-2 text-left transition-colors"
              >
                <span
                  className={`tracked-caps block text-xs transition-colors ${
                    isActive ? 'text-gold-deep' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {item.label}
                </span>
                <span className="block text-[10px] text-ink-soft/60">{item.sub}</span>
                {isActive && (
                  <motion.span
                    layoutId="category-underline"
                    className="absolute -bottom-[13px] left-2 right-2 h-[2px] bg-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
