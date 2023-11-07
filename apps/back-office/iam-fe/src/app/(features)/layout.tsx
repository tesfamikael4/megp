import { Shell } from '@megp/core-fe';
import type { Metadata } from 'next';

import { ShellProvider } from './shell';

export const metadata: Metadata = {
  title: 'M-egp | IAM',
  description: 'Identity and access management',
  icons: {
    icon: '/iam/favicon/android-chrome-512x512.png',
  },
  manifest: '/iam/favicon/site.webmanifest',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <Shell> {children}</Shell>
    </ShellProvider>
  );
}
