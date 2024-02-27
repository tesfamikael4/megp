'use client';

// import Footer from '@/shared/components/footer/footer';
import Header from '@/shared/components/header/header';
import { Box } from '@mantine/core';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
