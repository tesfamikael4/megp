import type { Metadata } from 'next';
import './globals.css';

import { Providers } from '@/store/provider';
import RootStyleRegistry from './mantine';
import { ConfigProvider } from '@/contexts/config';
import { Config } from '@/models/config';
import { config } from '@/config/env';

export const metadata: Metadata = {
  title: 'M-egp',
  description: 'Malawi electronic government procurements',
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
