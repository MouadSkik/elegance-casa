'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Plus } from 'lucide-react';

type ProductCardProps = {
  product: Product;
  index: number;
  onAdd?: (product: Product) => void;
  onOrder?: (product: Product) => void;
};

export function ProductCard({ product, index, onAdd }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
      className="group flex flex-col justify-between overflow-hidden bg-transparent"
    >
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden rounded-[2rem] aspect-[4/5] bg-linen-deep shadow-[0_16px_40px_rgba(28,26,23,0.04)]">
        <motion.div 
          className="relative w-full h-full"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          {product.image ? (
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              sizes="(max-width: 767px) 50vw, 25vw" 
              className="object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-[#f2ede5]" />
          )}
        </motion.div>

        {/* Premium Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/70" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white z-10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#C5A880] font-light">{product.category}</p>
          <h3 className="mt-1 font-display text-xl leading-tight text-white/95">{product.name}</h3>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-4 px-2 pt-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-light">Prix</p>
          <p className="mt-0.5 text-base font-medium text-[#2E2724]">{product.price} MAD</p>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd?.(product);
          }}
          className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white/80 text-[#2E2724] transition-all duration-300 hover:border-[#D4A393] hover:bg-[#D4A393] hover:text-white"
          aria-label="Ajouter au panier"
        >
          <Plus size={15} strokeWidth={1.5} />
        </button>
      </div>
    </motion.article>
  );
}
