import './globals.css';
import type { Metadata } from 'next';

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
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  );
}
