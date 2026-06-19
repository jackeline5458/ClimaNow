// ============================================================
// layout.tsx — layout raiz do Next.js App Router
// ============================================================

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ClimaNow — Previsão do tempo inteligente',
  description:
    'Previsão do tempo em tempo real com dicas inteligentes, baseado em Open-Meteo.',
  keywords: ['clima', 'tempo', 'previsão', 'temperatura', 'chuva'],
  authors: [{ name: 'ClimaNow' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'ClimaNow',
    description: 'Previsão do tempo inteligente',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#1e90ff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
