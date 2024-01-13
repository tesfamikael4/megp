'use client';
import { PageLayout } from '@megp/core-fe';
import PlanYearTab from '@/app/(features)/_components/pr-tab';
import { useParams } from 'next/navigation';
export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  return (
    <PageLayout>
      <>
        {id && <PlanYearTab />}
        {children}
      </>
    </PageLayout>
  );
}
