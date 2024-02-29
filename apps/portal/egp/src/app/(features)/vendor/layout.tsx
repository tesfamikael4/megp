'use client';
import { Flex } from '@mantine/core';
import styles from './layout.module.scss';
import 'mantine-datatable/styles.css';

interface Props {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: Props) {
  return (
    <Flex>
      <main className={styles.main}>{children}</main>
    </Flex>
  );
}
