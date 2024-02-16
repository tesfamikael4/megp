'use client';
import { Flex, Title } from '@mantine/core';
import { useState } from 'react';
import Sidebar from './_components/sidebar/sidebar';
import styles from './layout.module.scss';
import Protected from '../protected';
import { Categories } from './tender/categories-list';
interface Props {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: Props) {
  const [isSidebarOpen] = useState(false);

  return (
    <Flex>
      <nav
        data-open={isSidebarOpen}
        className={styles.nav}
        style={{ backgroundColor: '#f5fbfe' }}
      >
        <Categories />
      </nav>
      <main className={styles.main}>{children}</main>
    </Flex>
  );
}
