'use client';
import { PageLayout } from '@megp/core-fe';
import PlanYearTab from '@/app/(features)/procurement-requisition/_components/pr-tab';
import { useParams } from 'next/navigation';
import '@mantine/dates/styles.css';

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
