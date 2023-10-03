import React from 'react';
import styles from './page.module.scss';

export function SideBar({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className={styles.sideBar}>
      <div className={styles.header}> Menu</div>
      {children}
    </div>
  );
}
