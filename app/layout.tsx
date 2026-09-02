import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Perfect Dim — забудовник будинків біля Луцька',
  description:
    'Perfect Dim проєктує та будує одноповерхові будинки й дуплекси біля Луцька — з відкритою комплектацією та зрозумілими етапами робіт.',
  openGraph: {
    title: 'Perfect Dim — забудовник будинків біля Луцька',
    description: 'Будинки й дуплекси з відкритою комплектацією та зрозумілими етапами робіт.',
    images: ['/og.png'],
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perfect Dim — забудовник будинків біля Луцька',
    description: 'Будинки й дуплекси з відкритою комплектацією та зрозумілими етапами робіт.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
