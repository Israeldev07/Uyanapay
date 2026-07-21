import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-grotesk',
});

export const metadata: Metadata = {
  title: 'UYanapay — Conexión universitaria a tu servicio',
  description:
    'UYanapay conecta estudiantes, docentes y personal universitario con personas dispuestas a ayudarte en compras, trámites, entregas y servicios profesionales dentro de la comunidad universitaria.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body style={{ fontFamily: 'var(--font-manrope), system-ui, sans-serif' }}>{children}</body>
    </html>
  );
}
