import { Shell } from '@megp/core-fe';
import type { Metadata } from 'next';

import { ShellProvider } from './shell';
import Protected from './protected';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <ShellProvider>
        <Shell> {children}</Shell>
      </ShellProvider>
    </Protected>
  );
}
