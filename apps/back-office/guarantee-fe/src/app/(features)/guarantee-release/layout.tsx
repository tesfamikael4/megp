import { Entity } from './entity';
export default function EntityLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return <Entity>{children}</Entity>;
}
