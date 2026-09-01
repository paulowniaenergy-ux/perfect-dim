import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Perfect Dim — будинки біля Луцька',
  description:
    'Добірні будинки у найкращих локаціях поблизу Луцька. Перевірені об’єкти, чесний супровід і турбота на кожному кроці.',
  openGraph: {
    title: 'Perfect Dim — будинки біля Луцька',
    description: 'Добірні будинки у найкращих локаціях поблизу Луцька.',
    images: ['/og.png'],
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perfect Dim — будинки біля Луцька',
    description: 'Добірні будинки у найкращих локаціях поблизу Луцька.',
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
