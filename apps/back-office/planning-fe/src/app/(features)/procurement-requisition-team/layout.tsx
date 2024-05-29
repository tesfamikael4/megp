'use client';
import PrTab from '@/app/(features)/procurement-requisition/_components/pr-tab';
import { useParams } from 'next/navigation';
import '@mantine/dates/styles.css';
import { Box } from '@mantine/core';

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  return (
    <>
      <Box className="min-h-screen">
        {id && <PrTab />}
        {children}
      </Box>
    </>
  );
}
