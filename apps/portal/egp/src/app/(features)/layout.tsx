'use client';
import Header from '@/shared/components/header/header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="w-full min-h-[calc(100vh-64px)]">{children}</div>
    </>
  );
}
