import { Shell } from '@megp/core-fe';
import { ShellProvider } from './shell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <Shell> {children}</Shell>
    </ShellProvider>
  );
}
