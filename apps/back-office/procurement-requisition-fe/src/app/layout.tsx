import './globals.css';
import { Providers } from '@/store/provider';
import type { Metadata } from 'next';
import RootStyleRegistry from './mantine';

import { Inter, Roboto_Mono } from 'next/font/google';
import { AuthProvider } from '@megp/auth';

import 'mantine-datatable/styles.css';

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

export const metadata: Metadata = {
  title: 'M-egp | Procurement Requisition',
  description: 'Procurement Requisition',
  icons: {
    icon: '/procurement-requisition/favicon/android-chrome-512x512.png',
  },
  manifest: '/procurement-requisition/favicon/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body suppressHydrationWarning={true}>
        <Providers>
          <RootStyleRegistry>
            <AuthProvider>{children}</AuthProvider>
          </RootStyleRegistry>
        </Providers>
      </body>
    </html>
  );
}
