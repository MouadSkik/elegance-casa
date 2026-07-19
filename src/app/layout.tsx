import type { Metadata } from 'next';
import '../styles/globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Élégance Casa — Haute Joaillerie',
  description: 'Showroom privé de bijoux et accessoires exclusifs, Casablanca.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* CRITICAL FONT LINK MATRIX INJECTION — Unlocks Playfair Display and Jost */}
        <link rel="preconnect" href="https://googleapis.com" />
        <link rel="preconnect" href="https://gstatic.com" crossOrigin="anonymous" />
        <link href="https://googleapis.com/css2?family=Jost:ital,wght@0,100..400;1,100..400&family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-[#c5a880]/30">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
