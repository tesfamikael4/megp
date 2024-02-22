'use client';
import { Box, Flex, Input, Select, SimpleGrid, Text } from '@mantine/core';
import React from 'react';
import { Categories } from './categories-list';
import { useMediaQuery } from '@mantine/hooks';
import TenderCard from '../../_components/tender-card';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import styles from './layout.module.scss';

const TenderLayout = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box className="flex">
      <nav
        className={styles.nav}
        style={{
          backgroundColor: '#f5fbfe',
          display: isMobile ? 'none' : 'block',
        }}
      >
        <Categories />
      </nav>
      <main className={styles.main}>
        <Box px={{ base: 'xs', sm: 'lg' }}>
          <Flex
            align={'center'}
            justify={'space-between'}
            gap={4}
            direction={{ base: 'column', sm: 'row' }}
          >
            <Text> All Tenders</Text>
            <Flex
              align={'center'}
              className="w-auto"
              justify={{ base: 'center', sm: 'flex-end' }}
            >
              <Input
                size="xs"
                placeholder="Search Tenders Here"
                leftSection={<IconSearch />}
                className="flex-grow bg-[#f5fbfe]"
              />
              <Flex ml={'sm'} className="w-fit border-b" align={'center'}>
                <Text className="w-full">Sort By:</Text>
                <Select
                  size="xs"
                  placeholder="All"
                  variant="unstyled"
                  className="w-fit"
                  rightSection={<IconChevronDown />}
                  data={['All', 'latest']}
                />
              </Flex>
            </Flex>
          </Flex>
          <SimpleGrid
            mt={{ base: 10, sm: 20 }}
            cols={{ base: 1, sm: 2, md: 2, lg: 2 }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <TenderCard key={index} color={'orange'} />
            ))}
          </SimpleGrid>
        </Box>
      </main>
    </Box>
  );
};

export default TenderLayout;
