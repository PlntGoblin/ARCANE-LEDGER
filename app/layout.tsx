import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Cinzel_Decorative } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import SessionProviderWrapper from './components/SessionProviderWrapper';
import TopNav from './components/TopNav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: '--font-cinzel-decorative',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Grimoire',
  description: 'A D&D 5e character sheet application',
};

// Applies site-wide unless a page overrides it (app/page.tsx sets a
// mobile-scaling width for the character sheet). Sets theme_color for
// standalone/PWA installs and mobile browser chrome.
export const viewport: Viewport = {
  themeColor: '#030712',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzelDecorative.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <TopNav />
          {children}
        </SessionProviderWrapper>
        <Analytics />
      </body>
    </html>
  );
}
