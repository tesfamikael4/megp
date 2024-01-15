import { Shell } from '@megp/core-fe';
import type { Metadata } from 'next';

import { ShellProvider } from './shell';
import Protected from './protected';

export const metadata: Metadata = {
  title: 'M-egp | Administration',
  description: 'Administration',
  icons: {
    icon: '/administration/favicon/android-chrome-512x512.png',
  },
  manifest: '/administration/favicon/site.webmanifest',
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
