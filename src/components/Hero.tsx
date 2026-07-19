'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="tracked-caps mb-6 text-xs text-gold-deep"
            >
              Façonné à la main — pièce par pièce
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              className="font-display text-[13vw] leading-[0.95] tracking-tight text-ink md:text-6xl lg:text-7xl"
            >
              L&apos;or se porte
              <br />
              <span className="italic text-gold-deep">au quotidien.</span>
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-sm text-sm leading-relaxed text-ink-soft md:text-base"
          >
            Cent vingt-neuf pièces, cinq vitrines. Chaque bague, chaîne et
            parure d&apos;Élégance Casa est pensée pour traverser les
            générations — de notre atelier de Casablanca à votre écrin.
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full opacity-40 blur-3xl md:h-96 md:w-96"
        style={{ background: 'radial-gradient(circle, #C5A880 0%, transparent 70%)' }}
      />
    </section>
  );
}
