import { List } from './list';
import { EntityLayout } from '@megp/core-fe';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <EntityLayout>
      <List />
      {children}
    </EntityLayout>
  );
}
