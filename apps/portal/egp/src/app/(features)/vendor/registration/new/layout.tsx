import LayoutComponent from './_components/layout/layoutComponent';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LayoutComponent>{children}</LayoutComponent>;
}
