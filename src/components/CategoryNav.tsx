'use client';

import { motion } from 'framer-motion';
import type { Category } from '@/lib/types';

type CategoryNavProps = {
  categories: Category[];
  active: string;
  onChange: (slug: any) => void;
};

export function CategoryNav({ categories, active, onChange }: CategoryNavProps) {
  // Combine custom database entries with a clean "TOUS" fallback index anchor
  const items = [{ slug: 'tout', label: 'Tous les produits', sub: 'All Collections' }, ...categories];

  return (
    <nav className="w-full bg-[#fcfaf4] border-b border-[#e3d9bf]/30 py-8 relative z-20">
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-center min-w-max md:min-w-0 space-x-12 lg:space-x-16 mx-auto">
          {items.map((item) => {
            const isCurrent = active === item.slug;
            return (
              <button
                key={item.slug}
                onClick={() => onChange(item.slug)}
                className="group relative flex flex-col items-center py-2 transition-all duration-500 focus:outline-none cursor-pointer text-center"
              >
                {/* French primary tracking tag - expanded text weights */}
                <span className={`font-sans text-[11px] font-medium tracking-[0.26em] uppercase transition-colors duration-500 ${
                  isCurrent ? 'text-[#111111]' : 'text-neutral-400 group-hover:text-[#111111]'
                }`}>
                  {item.label}
                </span>

                {/* Secondary decorative layout label subtitle - cursive styling accent */}
                <span className={`font-display text-[12px] italic mt-1 font-light tracking-wide transition-colors duration-500 ${
                  isCurrent ? 'text-[#c5a880]' : 'text-neutral-400/50 group-hover:text-[#c5a880]/70'
                }`}>
                  {item.sub}
                </span>

                {/* Flowing animated gold active indicator line token */}
                {isCurrent && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 h-[1px] w-8 bg-[#c5a880]"
                    transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
