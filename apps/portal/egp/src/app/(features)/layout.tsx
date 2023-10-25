import Footer from '@/shared/components/footer/footer';
import Header from '@/shared/components/header/header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
