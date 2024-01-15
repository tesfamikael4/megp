import React from 'react';
import styles from './page.module.scss';

export function PageLayout({
  layout = 'center',
  children,
}: {
  layout?: 'center' | 'full';
  children: React.ReactElement;
}): React.ReactElement {
  return (
    <div className={layout === 'full' ? styles.full : styles.center}>
      {children}
    </div>
  );
}
