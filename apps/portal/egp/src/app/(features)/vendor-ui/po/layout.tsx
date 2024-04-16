'use client';
import { Flex } from '@mantine/core';
import { useState } from 'react';
import styles from './layout.module.scss';
import Sidebar from './_components/sidebar/sidebar';
interface Props {
  children: React.ReactNode;
}
export default function WorkspaceLayout({ children }: Props) {
  const [isSidebarOpen] = useState(false);

  return (
    <Flex className="min-h-full">
      <nav data-open={isSidebarOpen} className={styles.nav}>
        <Sidebar />
      </nav>
      <section className={styles.main}>{children}</section>
    </Flex>
  );
}
