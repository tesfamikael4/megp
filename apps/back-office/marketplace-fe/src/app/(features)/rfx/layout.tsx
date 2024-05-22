'use client';
import '@mantine/dates/styles.css';
import { Box } from '@mantine/core';

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Box className="min-h-screen">{children}</Box>
    </>
  );
}
