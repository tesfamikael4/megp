import { PageLayout } from '@megp/core-fe';
export default function EntityLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return <PageLayout>{children}</PageLayout>;
}
