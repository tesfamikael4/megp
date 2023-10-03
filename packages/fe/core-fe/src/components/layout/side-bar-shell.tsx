import React from 'react';
import styles from './page.module.scss';

export function SideBarShell({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <div className={styles.sideBarShell}>{children}</div>;
}
