'use client';

// import Footer from '@/shared/components/footer/footer';
import Header from '@/shared/components/header/header';
import Footer from './(landing)/_components/footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
