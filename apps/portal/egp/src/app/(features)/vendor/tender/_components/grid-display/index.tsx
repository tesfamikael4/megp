'use client';
import { Box, SimpleGrid, Text } from '@mantine/core';
import React, { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import styles from './grid-display.module.scss';
import TenderCard from '@/app/(features)/_components/tender-card';
import Navbar from '../nav-bar';
import HeaderNav from '../header-nav-bar';

const GridDisplay = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Box className="flex">
        <nav
          className={styles.nav}
          style={{
            backgroundColor: '#f5fbfe',
            display: isMobile ? 'none' : 'block',
          }}
        >
          <Navbar />
        </nav>
        <main className={styles.main}>
          <Box px={{ base: 'xs', sm: 'lg' }}>
            <HeaderNav />

            <SimpleGrid
              mt={{ base: 10, sm: 20 }}
              cols={{ base: 1, sm: 2, md: 2, lg: 2 }}
              spacing={{ base: 10, sm: 10, md: 10, lg: 10 }}
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <TenderCard key={index} color={'orange'} />
              ))}
            </SimpleGrid>
          </Box>
        </main>
      </Box>
    </>
  );
};

export default GridDisplay;
