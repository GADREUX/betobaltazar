import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Beto Baltazar Corretor — Imóveis em Capão Bonito/SP',
  description: 'Corretor de Imóveis em Capão Bonito/SP. CRECI 318284-F. Compra, venda e locação com transparência e cuidado.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#1A1A1A', color: '#fff', borderRadius: '12px', fontSize: '14px' } }} />
      </body>
    </html>
  );
}
