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
    <section id="catalogue" className="bg-[#fcfaf4] transition-colors duration-500">
      {/* Category Selection Component Navigation Slider */}
      <CategoryNav categories={populatedCategories} active={active} onChange={handleCategoryChange} />

      {/* Heavy Editorial Whitespace Padding Blocks - py-24 md:py-36 */}
      <div className="mx-auto max-w-7xl px-8 py-24 md:py-36">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-[#e3d9bf]/20 pb-12"
        >
          <div className="space-y-3">
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#a8845c] font-light">
              {activeCategory ? activeCategory.sub : 'Maison Royale'}
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-[#111111] tracking-wide leading-tight">
              {activeCategory ? activeCategory.label : 'Tous les produits'}{' '}
              <span className="text-degrade-gold italic font-normal">sélectionnés</span>
            </h2>
          </div>
          
          <p className="max-w-md font-sans text-[13px] font-light leading-relaxed text-neutral-400 md:px-6">
            {activeCategory
              ? activeCategory.description
              : "L'ensemble de notre collection fine, ordonnée avec soin en une vitrine unique."}
          </p>
          
          <p className="font-sans text-[10px] tracking-[0.24em] uppercase text-neutral-300 font-light shrink-0">
            {items.length.toString().padStart(2, '0')} pièces exclusives
          </p>
        </motion.div>

        {/* Product Grid Card Elements Deck System */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-16 md:grid-cols-3 lg:grid-cols-4">
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
