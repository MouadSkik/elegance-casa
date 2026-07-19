'use client';

import { ArrowUpRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Product } from '@/data/products';

type ProductCardProps = { product: Product; index: number; onAdd: (product: Product) => void; onOrder: (product: Product) => void };

export function ProductCard({ product, index, onAdd, onOrder }: ProductCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.72, delay: Math.min(index, 10) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
      onClick={() => onOrder(product)}
    >
      <motion.div
        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-charcoal/8 bg-[#f2ede5] shadow-[0_24px_70px_rgba(28,26,23,0.06)]"
        whileHover={{ borderColor: 'rgba(197,168,128,0.72)' }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.045 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={product.imageSrc} alt={product.name} fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw" className="object-cover" />
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,26,23,0.66),rgba(28,26,23,0.08)_40%,transparent_75%)]" />

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.isOnSale && (
            <motion.span
              className="inline-flex w-fit items-center rounded-full bg-gold px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-charcoal shadow-[0_10px_24px_rgba(28,26,23,0.14)]"
              whileHover={{ y: -2 }}
            >
              SOLDE
            </motion.span>
          )}
        </div>

        <motion.span
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          whileHover={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-cream/20 bg-cream/92 text-charcoal shadow-[0_14px_28px_rgba(28,26,23,0.16)] backdrop-blur-md"
        >
          <ArrowUpRight size={18} />
        </motion.span>

        <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold/90">{product.category}</p>
          <h3 className="mt-2 font-display text-2xl leading-[1.05]">{product.name}</h3>
          <p className="mt-2 max-w-[26ch] text-[13px] leading-6 text-cream/76">{product.description}</p>
        </div>
      </motion.div>

      <div className="flex items-end justify-between gap-4 px-1 pt-5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/42">Prix</p>
          <p className="mt-1 text-lg font-medium text-charcoal">{product.priceMad} MAD</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onAdd(product);
            }}
            className="grid h-10 w-10 place-items-center rounded-full border border-charcoal/12 bg-cream/80 text-charcoal transition hover:border-gold/70 hover:bg-gold"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
