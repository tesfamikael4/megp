import { Providers } from '@/store/provider';
import './globals.css';
import type { Metadata } from 'next';
import RootStyleRegistry from './mantine';
import '@megp/theme/theme.scss';
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
