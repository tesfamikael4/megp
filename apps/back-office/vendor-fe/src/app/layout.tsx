import { Providers } from '@/store/provider';
import { Shell } from '@megp/core-fe';
import RootStyleRegistry from './mantine';

import { Inter, Roboto_Mono } from 'next/font/google';

import { ShellProvider } from './shell';
import { Metadata } from 'next';

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
  title: 'M-egp | Vendor',
  description: 'Vendor management',
  icons: {
    icon: '/vendors/favicon/android-chrome-512x512.png',
  },
  manifest: '/vendors/favicon/site.webmanifest',
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
