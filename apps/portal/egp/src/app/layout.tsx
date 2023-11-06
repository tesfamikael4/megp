import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import './globals.css';

import { config } from '@/config/env';
import { ConfigProvider } from '@/contexts/config';
import { Providers } from '@/store/provider';
import RootStyleRegistry from './mantine';
import { AuthProvider } from '@megp/auth/src/context/auth.context';

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
    <html lang="en" data-mantine-color-scheme="light">
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
