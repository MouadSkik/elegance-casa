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
};

export function ProductCard({ product, index, onAdd }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: Math.min((index % 4) * 0.08, 0.3), ease: [0.215, 0.61, 0.355, 1] }}
      className="group flex flex-col justify-between overflow-hidden bg-transparent"
    >
      {/* Product Image Frame with Hover Zoom */}
      <Link 
        href={`/product/${product.id}`} 
        className="block relative overflow-hidden rounded-[1.75rem] aspect-[4/5] bg-[#f3ebe0] border border-transparent transition-all duration-500 group-hover:border-[#D4A393]/40 shadow-[0_12px_32px_rgba(28,26,23,0.03)]"
      >
        <motion.div 
          className="relative w-full h-full"
          whileHover={{ scale: 1.045 }}
          transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
        >
          {product.image ? (
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              sizes="(max-width: 767px) 50vw, 25vw" 
              className="object-cover"
              priority={index < 4}
            />
          ) : (
            <div className="w-full h-full bg-[#f2ede5]" />
          )}
        </motion.div>

        {/* Force the custom yellow-gold status badge to display on every item card */}
        {true && (
          <motion.span 
            whileHover={{ y: -1 }}
            className="absolute top-4 left-4 bg-[#C5A880] text-[#FAF6F0] text-[9px] tracking-[0.2em] font-light uppercase px-3 py-1 rounded-full shadow-sm z-10 select-none"
          >
            SOLDE
          </motion.span>
        )}


        {/* Linear Luxury Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/60 z-0" />

        {/* Floating Bottom Card Labels */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white z-10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#C5A880]/90 font-light">{product.category}</p>
          <h3 className="mt-1 font-display text-xl font-light leading-tight text-white/95 group-hover:text-[#FAF6F0] transition-colors duration-300">
            {product.name}
          </h3>
        </div>
      </Link>

      {/* Pricing Matrix Deck Bar */}
      <div className="flex items-center justify-between gap-4 px-2 pt-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-light">Prix</p>
          <p className="mt-0.5 text-base font-medium text-[#a8845c] tracking-wide transition-colors duration-300 group-hover:text-[#8c6b45]">
            {product.price} MAD
          </p>
        </div>

        {/* Circular Action Plus Core Widget */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd?.(product);
          }}
          className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-[#FAF6F0]/80 text-[#1C1A17] transition-all duration-300 hover:border-[#D4A393] hover:bg-[#D4A393] hover:text-[#FAF6F0] shadow-sm active:scale-95"
          aria-label={`Ajouter ${product.name} au panier`}
        >
          <Plus size={15} strokeWidth={1.5} />
        </button>
      </div>
    </motion.article>
  );
}
