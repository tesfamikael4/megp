import { PageLayout } from '@megp/core-fe';
import { Entity } from './entity';
import { PlanYearTab } from '@/app/(features)/_components/plan-year-tab';
export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <>
        <PlanYearTab collapsed={false} />
        <Entity>{children}</Entity>
      </>
    </PageLayout>
  );
}
