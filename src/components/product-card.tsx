'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { ShoppingBag } from 'lucide-react';

type ProductCardProps = {
  product: Product;
  index: number;
  onAdd?: (product: Product) => void;
};

export function ProductCard({ product, index, onAdd }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: Math.min((index % 4) * 0.08, 0.3), ease: [0.215, 0.61, 0.355, 1] }}
      className="group relative flex flex-col overflow-hidden bg-transparent"
    >
      {/* Editorial Borderless Image Box with Slow Cinematic Hover Zoom */}
      <Link 
        href={`/product/${product.id}`} 
        className="block relative overflow-hidden rounded-[1.75rem] aspect-[4/5] bg-[#f2ebd4] shadow-[0_12px_40px_rgba(28,26,23,0.03)]"
      >
        <motion.div 
          className="relative w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
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
            <div className="w-full h-full bg-[#e3d9bf]" />
          )}
        </motion.div>

        {/* Global SOLDE Status Sticker - Renders on every item card */}
        <span className="absolute top-4 left-4 bg-[#C5A880] text-[#fcfaf4] text-[9px] tracking-[0.2em] font-light uppercase px-3 py-1 rounded-full shadow-sm z-20 select-none">
          SOLDE
        </span>

        {/* Elegant Vignette Shadow Overlay Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none transition-opacity duration-300 z-10" />

        {/* Title Placement Overlay Inside the Image Frame */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white z-20">
          <p className="text-[9px] uppercase tracking-[0.22em] text-[#C5A880] font-light">
            {product.category}
          </p>
          <h3 className="mt-1 font-display text-xl font-light leading-tight text-white/95 transition-colors duration-300 group-hover:text-[#f4ead0]">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-neutral-300/80 font-light line-clamp-1">
            {product.material}
          </p>
        </div>
      </Link>

      {/* Clean Bottom Meta Row Displaying Prices in Champagne Gold Layouts */}
      <div className="flex items-center justify-between gap-4 px-2 pt-3.5">
        <div className="flex flex-col">
          <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-light">Prix</p>
          <p className="text-base font-medium text-[#a8845c] tracking-wide transition-colors duration-300 group-hover:text-[#8c6b45]">
            {product.price} MAD
          </p>
        </div>

        {/* Minimalist Floating Quick Add Circular Action Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd?.(product);
          }}
          className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200/80 bg-white/90 text-[#111111] transition-all duration-300 hover:border-[#D4A393] hover:bg-[#D4A393] hover:text-white shadow-sm active:scale-95"
          aria-label="Ajouter au panier"
        >
          <ShoppingBag size={14} strokeWidth={1.5} />
        </button>
      </div>
    </motion.article>
  );
}
