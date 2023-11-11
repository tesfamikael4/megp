import './globals.css';
import { Providers } from '@/store/provider';
import type { Metadata } from 'next';
import RootStyleRegistry from './mantine';

export const metadata: Metadata = {
  title: 'M-egp | Demo',
  description: 'Demo app for M-egp',
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
