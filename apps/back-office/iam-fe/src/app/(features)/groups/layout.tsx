import { PageLayout } from '@megp/core-fe';
import { Entity } from './entity';
export default function EntityLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <PageLayout>
      <Entity>{children}</Entity>
    </PageLayout>
  );
}
