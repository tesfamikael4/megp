'use client';

import { Button } from '@mantine/core';
import { useEffect } from 'react';
import useToggle from '@megp/core-fe/src/hooks/use-toogle';
import styles from './section.module.scss';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface SectionProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  action?: React.ReactNode;
  collapsible?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: (boolean) => void;
  className?: string;
  defaultCollapsed?: boolean;
  // styles
  w?: string;
  mh?: string;
}

export function Section({
  title,
  subTitle,
  action,
  children,
  className = '',
  collapsible = true,
  w = '',
  mh,
  setIsCollapsed,

  defaultCollapsed = false,
}: SectionProps): React.ReactElement {
  const [showBody, toggle] = useToggle(!defaultCollapsed);

  useEffect(() => {
    if (setIsCollapsed) {
      !showBody ? setIsCollapsed(true) : setIsCollapsed(false);
    }
  }, [setIsCollapsed, showBody]);
  return (
    <div
      className={`${className} ${styles.container} ${
        !showBody ? styles.collapsed : ''
      }`}
      style={{ width: w }}
    >
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.subTitle}>{subTitle}</div>
        </div>
        <div className={styles.action}>
          {showBody ? action : null}

          {collapsible ? (
            showBody ? (
              <IconChevronUp className="cursor-pointer" onClick={toggle} />
            ) : (
              <IconChevronDown className="cursor-pointer" onClick={toggle} />
            )
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
