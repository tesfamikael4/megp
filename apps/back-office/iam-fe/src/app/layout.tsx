import { Providers } from '@/store/provider';
import type { Metadata } from 'next';
import RootStyleRegistry from './mantine';
import { Shell } from '@megp/core-fe';

import { Inter, Roboto_Mono } from 'next/font/google';

import { createContext } from 'react';
import { ShellProvider } from './shell';

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
        <Providers>
          <RootStyleRegistry>
            <ShellProvider>
              <Shell> {children}</Shell>
            </ShellProvider>
          </RootStyleRegistry>
        </Providers>
      </body>
    </html>
  );
}
