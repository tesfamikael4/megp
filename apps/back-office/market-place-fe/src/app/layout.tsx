import './globals.css';
import { Providers } from '@/store/provider';
import type { Metadata } from 'next';
import RootStyleRegistry from './mantine';

import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

import { ConfigProvider } from '@/contexts/config';
import { config } from '@/config/env';
import { AuthProvider } from '@megp/auth';

export const metadata: Metadata = {
  title: 'M-egp | market-place',
  description: 'market-place',
  icons: {
    icon: '/market-place/favicon/android-chrome-512x512.png',
  },
  manifest: '/market-place/favicon/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body suppressHydrationWarning={true}>
        <ConfigProvider config={config}>
          <Providers>
            <RootStyleRegistry>
              <AuthProvider>{children}</AuthProvider>
            </RootStyleRegistry>
          </Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}
