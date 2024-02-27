import { PageLayout, Shell } from '@megp/core-fe';
import { Entity } from './entity';
import { ShellProvider } from '../../shell';
import Protected from '@/app/(features)/protected';
export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected>
      <ShellProvider>
        <Shell>
          <PageLayout>
            <Entity>{children}</Entity>
          </PageLayout>
        </Shell>
      </ShellProvider>
    </Protected>
  );
}
