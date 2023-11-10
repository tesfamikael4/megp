import { Shell } from '@megp/core-fe';

import { Metadata } from 'next';
import React from 'react';
import { ShellProvider } from './shell';
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
    <ShellProvider>
      <Shell> {children}</Shell>
    </ShellProvider>
  );
}
