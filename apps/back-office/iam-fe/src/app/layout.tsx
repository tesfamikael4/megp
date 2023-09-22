import { Providers } from '@/store/provider';
import { Shell } from '@megp/core-fe';
import type { Metadata } from 'next';
import RootStyleRegistry from './mantine';

import { ShellProvider } from './shell';

import localFont from 'next/font/local';
const inter = localFont({
  src: './inter.ttf',
  display: 'swap',
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
    <html lang="en" className={inter.className}>
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
