import { Providers } from '@/store/provider';
import RootStyleRegistry from './mantine';

import '@megp/theme/theme.scss';
import { Metadata } from 'next';
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
          <RootStyleRegistry>{children}</RootStyleRegistry>
        </Providers>
      </body>
    </html>
  );
}
