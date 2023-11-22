import { Entity } from './entity';

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return <Entity>{children}</Entity>;
  return <>{children}</>;
}
