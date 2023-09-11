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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body className="bg-gray-100">
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
