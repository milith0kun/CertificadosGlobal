import './globals.css';

export const metadata = {
  metadataBase: new URL('https://certificadosglobal.vercel.app'),
  title: {
    default: 'Certificados Global | CIIP Latam - Geomina - Biomedic',
    template: '%s | Certificados Global',
  },
  description: 'Plataforma de gestión, emisión y validación de certificados digitales y contratos docentes del ecosistema CIIP Latam, Geomina y Biomedic.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    title: 'Certificados Global | CIIP Latam',
    description: 'Gestión, emisión y validación de certificados digitales y contratos docentes.',
    locale: 'es_PE',
    siteName: 'Certificados Global',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
