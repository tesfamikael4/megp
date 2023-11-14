import { PageLayout, Shell } from '@megp/core-fe';
import { Entity } from './entity';
import { ShellProvider } from '../../shell';
export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShellProvider>
      <Shell>
        <PageLayout>
          <Entity>{children}</Entity>
        </PageLayout>
      </Shell>
    </ShellProvider>
  );
}
