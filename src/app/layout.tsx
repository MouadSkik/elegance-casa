import type { Metadata } from 'next';
import '../styles/globals.css';
import { CartProvider } from '@/context/CartContext';

// Loaded via <link> in <head> rather than next/font/google so the build
// never depends on reaching fonts.googleapis.com — swap for next/font/google
// or self-hosted files if you'd prefer build-time font optimization.
export const metadata: Metadata = {
  title: 'Élégance Casa — Joaillerie fine',
  description:
    "Élégance Casa, joaillerie fine à Casablanca. Bagues, chaînes, bracelets, parures et coffrets façonnés pour durer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <link href="https://googleapis.com" rel="stylesheet" />
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
