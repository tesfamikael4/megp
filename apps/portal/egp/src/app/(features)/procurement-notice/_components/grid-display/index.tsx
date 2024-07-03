'use client';
import { Box, SimpleGrid, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import styles from './grid-display.module.scss';
import TenderCard from '@/app/(features)/_components/tender-card';
import Navbar from '../nav-bar';
import HeaderNav from '../header-nav-bar';
import { useGetTendersQuery } from '../../_api/tender.api';
import PageWrapper from '@/app/(features)/_components/page-wrapper';
import EmptyDataPlaceholder from '@/app/(features)/_components/empty-data-placeholder';
import { useLazyGetTendersAndRFXsQuery } from '../../_api/rms.api';

const GridDisplay = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [trigger, { data: tenders, isLoading: isGettingTenders }] =
    useLazyGetTendersAndRFXsQuery();

  useEffect(() => {
    trigger({ skip: 0, take: 10 });
  }, []);

  return (
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
          <PageWrapper
            condition={tenders?.items.length > 0}
            isLoading={isGettingTenders}
            placeholder={<EmptyDataPlaceholder />}
          >
            <SimpleGrid
              mt={{ base: 10, sm: 20 }}
              cols={{ base: 1, sm: 2, md: 2, lg: 2 }}
              spacing={{ base: 10, sm: 10, md: 10, lg: 10 }}
            >
              {tenders &&
                tenders.items.map((tender, index) => (
                  <Box key={tender.id}>
                    {tender && <TenderCard key={index} tender={tender} />}
                  </Box>
                ))}
            </SimpleGrid>
          </PageWrapper>
        </Box>
      </main>
    </Box>
  );
};

export default GridDisplay;
