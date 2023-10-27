'use client';
import { Flex, Title } from '@mantine/core';
import { useState } from 'react';
import { Sidebar } from './_components/sidebar/sidebar';
import { sidebarLinks } from './_components/sidebar/config';
import styles from './layout.module.scss';
interface Props {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: Props) {
  const [isSidebarOpen, setCollapse] = useState(false);

  return (
    <Flex>
      <nav data-open={isSidebarOpen} className={styles.nav}>
        <Sidebar data={sidebarLinks} isCollapse={!isSidebarOpen} />
      </nav>
      <main className={styles.main}>{children}</main>
    </Flex>
  );
}
