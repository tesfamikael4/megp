import React from 'react';
import styles from './layout.module.scss';
import { Box } from '@mantine/core';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Box className={styles.main}>{children}</Box>;
}
