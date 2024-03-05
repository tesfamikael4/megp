'use client';
import { PageLayout } from '@megp/core-fe';
import '@mantine/dates/styles.css';

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout layout="full">
      <>{children}</>
    </PageLayout>
  );
}
