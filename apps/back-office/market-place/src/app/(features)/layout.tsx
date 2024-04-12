import { Shell } from '@megp/core-fe';
import type { Metadata } from 'next';
import '@mantine/dates/styles.css';

import { ShellProvider } from './shell';
import Protected from './protected';

export const metadata: Metadata = {
  title: 'M-egp | market-place',
  description: 'market-place',
  icons: {
    icon: '/market-place/favicon/android-chrome-512x512.png',
  },
  manifest: '/market-place/favicon/site.webmanifest',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <ShellProvider>
        <Shell> {children}</Shell>
      </ShellProvider>
    </Protected>
  );
}
