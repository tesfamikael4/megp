import './globals.css';
import type { Metadata } from 'next';

import RootStyleRegistry from './mantine';
import { Providers } from '@/store/provider';

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
