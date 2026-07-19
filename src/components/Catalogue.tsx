'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import type { CategorySlug } from '@/lib/types';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './product-card';

const PAGE_SIZE = 12;

export function Catalogue() {
  const [active, setActive] = useState<CategorySlug | 'tout'>('tout');
  const [page, setPage] = useState(1);

  const populatedCategories = useMemo(
    () => categories.filter((c) => products.some((p) => p.category === c.slug)),
    []
  );

  const activeCategory = useMemo(
    () => populatedCategories.find((c) => c.slug === active) ?? null,
    [active, populatedCategories]
  );

  const items = useMemo(
    () => (active === 'tout' ? products : products.filter((p) => p.category === active)),
    [active]
  );

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Any category-tab change resets pagination back to page 1, per spec.
  const handleCategoryChange = (slug: CategorySlug | 'tout') => {
    setActive(slug);
    setPage(1);
  };

  const handlePageChange = (n: number) => {
    setPage(n);
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Defensive guard: if the active filter ever produces fewer pages than
  // the current page number (e.g. inventory shrinks), snap back in range.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <section id="catalogue">
      <CategoryNav categories={populatedCategories} active={active} onChange={handleCategoryChange} />

      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-2 border-b rule pb-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="tracked-caps text-xs text-gold-deep">
              {activeCategory ? activeCategory.sub : 'All'}
            </p>
            
            <h2 id="catalogue" className="font-display text-3xl md:text-4xl lg:text-5xl font-light italic text-[#111111] tracking-wide mb-8">
              Tous les produits
            </h2>

          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            {activeCategory
              ? activeCategory.description
              : "L'ensemble de notre collection, réunie en une seule vitrine."}
          </p>
          <p className="tracked-caps shrink-0 text-xs text-ink-soft/60">
            {items.length.toString().padStart(2, '0')} pièces
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {pageItems.map((product, i) => (
            <ProductCard 
            key={product.id} 
            product={product} 
            index={i} 
            onAdd={() => {}}             />
            ))}

        </div>

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        )}
      </div>
    </section>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <nav
      aria-label="Pagination du catalogue"
      className="mt-14 flex items-center justify-center gap-2 text-xs tracking-widest text-ink-soft"
    >
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Page précédente"
        className="px-2 py-1 transition-colors hover:text-gold-deep disabled:opacity-30"
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`px-2 py-1 transition-colors hover:text-gold-deep ${
            n === page ? 'text-gold-deep' : ''
          }`}
        >
          {n}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Page suivante"
        className="px-2 py-1 transition-colors hover:text-gold-deep disabled:opacity-30"
      >
        &gt;
      </button>
    </nav>
  );
}
