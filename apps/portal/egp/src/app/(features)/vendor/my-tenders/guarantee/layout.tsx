'use client';
import { Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Sidebar from '../_components/sidebar/sidebar';
import styles from '../_components/sidebar/sidebar.module.scss';

const BidSecurity = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <Flex>
      <nav
        className={styles.nav}
        style={{
          backgroundColor: '#fff',
          display: isMobile ? 'none' : 'block',
        }}
      >
        <Sidebar />
      </nav>
      {children}
    </Flex>
  );
};

export default BidSecurity;
