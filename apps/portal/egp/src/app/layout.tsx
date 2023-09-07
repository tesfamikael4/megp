import type { Metadata } from 'next';
import './globals.css';

import { Providers } from '@/store/provider';
import RootStyleRegistry from './mantine';

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
      <body>
        <Providers>
          <RootStyleRegistry>{children}</RootStyleRegistry>
        </Providers>
      </body>
    </html>
  );
}
