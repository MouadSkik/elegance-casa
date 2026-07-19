import Image from 'next/image';
import Link from 'next/link';
import { NewsletterForm } from './NewsletterForm';

// "Tous les produits", "Collections" and "Boutique" all point at the same
// catalogue section for now, since the site is currently a single page —
// give them their own routes later and these links update in one place.
const MAISON_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Tous les produits', href: '/#catalogue' },
  { label: 'Collections', href: '/#catalogue' },
  { label: 'Boutique', href: '/#catalogue' },
];

export function Footer() {
  return (
    <footer className="border-t-[0.5px] border-[#D4A393]/20">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          {/* Column 1 — Brand core */}
          <div>
            <Image
              src="/products/Logo.png"
              alt="Élégance Casa"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
            <p className="mt-4 text-sm lowercase text-ink-soft">
              accessoires &amp; pyjamas de luxe, Casablanca.
            </p>
          </div>

          {/* Column 2 — Maison */}
          <div>
            <p className="tracked-caps text-xs font-light text-ink-soft">Maison</p>
            <ul className="mt-4 space-y-2">
              {MAISON_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-soft transition-colors hover:text-gold-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <p className="tracked-caps text-xs font-light text-ink-soft">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-ink-soft">
              <p>Salé, Maroc</p>
              <p>
                <a href="tel:+212774718902" className="transition-colors hover:text-gold-deep">
                  +212 7 74 71 89 02
                </a>
              </p>
            </div>
          </div>

          {/* Column 4 — Lettre / Newsletter */}
          <div>
            <p className="tracked-caps text-xs font-light text-ink-soft">Lettre</p>
            <p className="mt-4 text-sm text-ink-soft">Les nouveautés, en silence.</p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <p className="tracked-caps mt-16 text-center text-[10px] text-ink-soft/50">
          © 2026 ÉLÉGANCE CASA — TOUS DROITS RÉSERVÉS
        </p>
      </div>
    </footer>
  );
}
