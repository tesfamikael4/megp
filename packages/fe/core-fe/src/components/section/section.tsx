'use client';

import { Button } from '@mantine/core';
import useToggle from '../../hooks/use-toogle';
import styles from './section.module.scss';

interface SectionProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  action?: React.ReactNode;
  isCollapsible?: boolean;

  // styles
  mh?: string;
}

export function Section({
  title,
  subTitle,
  action,
  children,
  isCollapsible = true,
  mh,
}: SectionProps): React.ReactElement {
  const [showBody, toggle] = useToggle(true);

  return (
    <div className={`${styles.container} ${!showBody ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.subTitle}>{subTitle}</div>
        </div>
        <div className={styles.action}>
          {action}

          {isCollapsible ? (
            <Button onClick={toggle} variant="outline" w="82px">
              {showBody ? 'Collapse' : 'Expand'}
            </Button>
          ) : null}
        </div>
      </div>
      {showBody ? (
        <div className={styles.body} style={{ minHeight: mh }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
