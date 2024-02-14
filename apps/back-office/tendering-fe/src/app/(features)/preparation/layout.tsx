'use client';
import { PageLayout } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import '@mantine/dates/styles.css';
import TenderDetail from './_components/tender-detail';

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  return (
    <PageLayout>
      <>
        {id && <TenderDetail />}
        {children}
      </>
    </PageLayout>
  );
}
