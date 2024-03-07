'use client';
import Footer from './(landing)/_components/footer';
import Header from '@/shared/components/header/header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="w-full min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
