'use client';

import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Input,
  Select,
  SimpleGrid,
  Text,
} from '@mantine/core';
import React from 'react';
import { Categories } from './categories-list';
import { useDisclosure } from '@mantine/hooks';
import styles from './layout.module.scss';
import { CardWrapper } from '../../_components/tender-card/card-wrapper';
import TenderCard from '../../_components/tender-card';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';

const TenderLayout = () => {
  const [isSidebarOpen] = useDisclosure(false);
  return (
    <Box className="flex">
      <nav
        data-open={isSidebarOpen}
        className={styles.nav}
        style={{ backgroundColor: '#f5fbfe' }}
      >
        <Categories />
      </nav>
      <main className={styles.main}>
        <Box px={'xs'}>
          <Flex align={'center'} justify={'space-between'} my={'md'}>
            <Text>All Tenders</Text>
            <Flex align={'center'} className="w-1/3">
              <Input
                size="xs"
                placeholder="Search Tenders Here"
                leftSection={<IconSearch />}
                className="w-2/3 flex-end bg-[#f5fbfe]"
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
            mt={20}
            cols={{ base: 1, sm: 2, md: 2, lg: 2 }}
            spacing={{ base: 'xl', sm: 60, md: 30 }}
            verticalSpacing={{ base: 'xl', md: 50 }}
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
