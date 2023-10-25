import type { Metadata } from 'next';
import './globals.css';

import { config } from '@/config/env';
import { ConfigProvider } from '@/contexts/config';
import { Providers } from '@/store/provider';
import RootStyleRegistry from './mantine';

export const metadata: Metadata = {
  title: 'EGP',
  description: 'Malawi electronic government procurements',
  icons: {
    icon: '/favicon/android-chrome-512x512.png',
  },
  manifest: '/favicon/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
