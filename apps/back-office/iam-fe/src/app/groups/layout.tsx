import { List } from './list';

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <List />
      {children}
    </div>
  );
}
