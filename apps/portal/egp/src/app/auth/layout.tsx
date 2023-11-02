import { AuthLayout } from '@megp/core-fe/src/components';

export default function AuthLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout>
      <section suppressHydrationWarning={true}>{children}</section>
    </AuthLayout>
  );
}
