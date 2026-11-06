import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';

export const metadata: Metadata = {
  title: 'RAFFINI | Premium Erkaklar Kiyimlari',
  description: 'Raffini erkaklar kiyimlari do‘konining rasmiy Telegram Web App ilovasi. 11 ta filial Toshkent bo‘ylab.',
  icons: {
    icon: '/images/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07100D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="dark">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#07100D] antialiased select-none font-sans overflow-x-hidden">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

