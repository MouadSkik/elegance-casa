'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { WhatsAppButton } from './WhatsAppButton';

const NAV_LINKS = ['TOUS', 'BAGUES', 'BOUCLES', 'CHAÎNES', 'BRACELETS', 'PARURES'];

function scrollToCatalogue() {
  document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
}

/* 1. Infinite moving header marquee, powered by framer-motion */
const MARQUEE_TEXT =
  " LIVRAISON DISPONIBLE SUR TOUT LE MAROC — COMMANDEZ DIRECTEMENT VIA WHATSAPP ✨ SOLDES D'ÉTÉ — JUSQU'À -30% SUR UNE SÉLECTION DE BIJOUX EXCLUSIFS ";

function MarqueeBanner() {
  // Respect prefers-reduced-motion: render the text statically instead of
  // looping it, rather than forcing motion on people who've asked for less.
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden border-b rule py-2" style={{ backgroundColor: '#FAF6F0' }}>
      <motion.div
        className="flex w-max shrink-0 whitespace-nowrap text-xs font-light uppercase tracking-widest"
        style={{ color: '#2E2724' }}
        animate={shouldReduceMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={
          shouldReduceMotion ? undefined : { ease: 'linear', duration: 25, repeat: Infinity }
        }
      >
        {[0, 1].map((copy) => (
          <span key={copy} className="inline-block shrink-0">
            {MARQUEE_TEXT}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* 2. Minimalist floating navbar */
function FloatingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b rule bg-linen/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/products/Logo.png"
            alt="Élégance Casa"
            width={40}
            height={40}
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="font-display text-lg italic tracking-widest text-ink">
            Élégance <span className="text-gold-deep not-italic">Casa</span>
          </span>
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-ink-soft md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#catalogue"
              className="font-light transition-colors hover:text-gold-deep"
            >
              {link}
            </a>
          ))}
        </nav>

        <button
          onClick={scrollToCatalogue}
          className="border-[0.5px] border-[#C5A880] rounded-full px-6 py-1.5 text-xs tracking-widest uppercase transition-all hover:bg-[#C5A880] hover:text-white"
        >
          Découvrir
        </button>
      </div>
    </header>
  );
}

/* 3. Editorial hero canvas */
function EditorialHero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 text-center bg-[#FAF6F0]"
    >
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-[11px] tracking-[0.32em] text-ink-soft uppercase"
      >
        Accessoires &amp; Pyjamas · Casablanca
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mb-10"
      >
        <div
          className="absolute inset-0 -z-10 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(212,163,147,0.28) 0%, transparent 72%)' }}
        />
        <div className="flex h-48 w-48 items-center justify-center rounded-full border border-[#C5A880]/30 bg-white/60 p-3 shadow-[0_0_60px_rgba(197,168,128,0.25)] backdrop-blur-sm md:h-64 md:w-64">
          <Image
            src="/products/Logo.png"
            alt="Élégance Casa"
            width={256}
            height={256}
            priority
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
        className="font-display max-w-3xl text-3xl italic font-light leading-tight md:text-5xl lg:text-6xl"
      >
        <span style={{ color: '#2E2724' }}>Une présence.</span>{' '}
        <span style={{ color: '#D4A393' }}>Une sensation.</span>
      </motion.h1>

      <motion.button
        onClick={scrollToCatalogue}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#C5A880] px-7 py-2.5 text-xs tracking-widest uppercase text-ink transition-all hover:bg-[#C5A880] hover:text-white"
      >
        Découvrir
        <ArrowDown size={14} strokeWidth={1.5} />
      </motion.button>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-8 text-[9px] tracking-[0.3em] text-ink-soft/60 uppercase"
      >
        Scroll
      </motion.span>
    </section>
  );
}

export function Storefront() {
  return (
    <>
      <MarqueeBanner />
      <FloatingNavbar />
      <EditorialHero />
      <WhatsAppButton />
    </>
  );
}
