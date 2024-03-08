'use client';
import Header from '@/shared/components/header/header';
import { Box } from '@mantine/core';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box className="w-full min-h-screen">{children}</Box>
    </>
  );
}
