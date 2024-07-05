'use client';
import { Flex } from '@mantine/core';
import { useState } from 'react';
import styles from './layout.module.scss';
import Sidebar from '../_components/sidebar/sidebar';
import Protected from '@/app/(features)/protected';
interface Props {
  children: React.ReactNode;
}
export default function WorkspaceLayout({ children }: Props) {
  const [isSidebarOpen] = useState(false);

  return (
    <Protected>
      <Flex>
        <nav data-open={isSidebarOpen} className={styles.nav}>
          <Sidebar />
        </nav>
        <main className={styles.main}>{children}</main>
      </Flex>
    </Protected>
  );
}
