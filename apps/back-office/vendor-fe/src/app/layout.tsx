import { Providers } from '@/store/provider';
import { Shell } from '@megp/core-fe';
import RootStyleRegistry from './mantine';

import { Metadata } from 'next';
import { ShellProvider } from './shell';
import '@megp/theme/theme.scss';
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
    <html lang="en">
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
