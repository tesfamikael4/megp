import './globals.css';
import { Providers } from '@/store/provider';
import RootStyleRegistry from './mantine';
import './globals.css';

import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'M-egp | Vendor',
  description: 'Vendor management',
  icons: {
    icon: '/vendors/favicon/android-chrome-512x512.png',
  },
  manifest: '/vendors/favicon/site.webmanifest',
};

import { Inter, Roboto_Mono } from 'next/font/google';
import { AuthProvider } from '@megp/auth';
import Protected from './Protected';

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
