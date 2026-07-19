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

  const handleCategoryChange = (slug: CategorySlug | 'tout') => {
    setActive(slug);
    setPage(1);
  };

  const handlePageChange = (n: number) => {
    setPage(n);
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <section id="catalogue" className="bg-[#fcfaf4]">
      <CategoryNav categories={populatedCategories} active={active} onChange={handleCategoryChange} />

      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          {/* FIXED: Removed 'border-b rule' to wipe out that bothering dark separating line entirely */}
          className="mb-12 flex flex-col gap-4 pb-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#a8845c] font-light">
              {activeCategory ? activeCategory.sub : 'Maison'}
            </p>
            {/* FIXED: Applied your stylish editorial font family layout weights */}
            <h2 className="font-display text-3xl font-light italic text-[#2E2724] tracking-wide mt-2 md:text-4xl">
              {activeCategory ? activeCategory.label : 'Tous les produits'}
            </h2>
          </div>
          <p className="max-w-sm text-xs font-light leading-relaxed text-neutral-500">
            {activeCategory
              ? activeCategory.description
              : "L'ensemble de notre collection, réunie en une seule vitrine."}
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light shrink-0">
            {items.length.toString().padStart(2, '0')} pièces
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {pageItems.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
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
      className="mt-16 flex items-center justify-center gap-4 text-[11px] tracking-[0.2em] text-neutral-400 uppercase font-light"
    >
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Page précédente"
        className="px-2 py-1 transition-colors hover:text-[#c5a880] disabled:opacity-20 cursor-pointer"
      >
        Précédent
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`px-3 py-1 transition-all rounded-full cursor-pointer ${
            n === page ? 'text-[#FAF6F0] bg-[#c5a880] font-normal' : 'hover:text-[#c5a880]'
          }`}
        >
          {n}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Page suivante"
        className="px-2 py-1 transition-colors hover:text-[#c5a880] disabled:opacity-20 cursor-pointer"
      >
        Suivant
      </button>
    </nav>
  );
}
