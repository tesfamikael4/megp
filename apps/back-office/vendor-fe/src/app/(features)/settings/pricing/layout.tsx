'use client';

import { SideBarShell } from '@megp/core-fe';
import { Menu } from './sidebar';
function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <SideBarShell>
      <Menu />
      {children}
    </SideBarShell>
  );
}

export default Layout;
