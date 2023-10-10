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

import '@megp/theme/theme.scss';
import { ConfigProvider } from '@/contexts/config';
import { config } from '@/config/env';

export const metadata: Metadata = {
  title: 'M-egp | IAM',
  description: 'Identity and access management',
  icons: {
    icon: '/iam/favicon/android-chrome-512x512.png',
  },
  manifest: '/iam/favicon/site.webmanifest',
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
            <RootStyleRegistry>{children}</RootStyleRegistry>
          </Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}
