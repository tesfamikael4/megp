'use client';
import React from 'react';
import { Box, Flex, Input, Select, SimpleGrid, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import TenderCard from '../../../_components/tender-card';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';

const MyTendersLayout = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box className="flex">
      <main className="main bg-white m-4 w-full p-4">
        <Box className="mb-1">
          <Flex
            align={'center'}
            justify={'space-between'}
            gap={4}
            direction={{ base: 'column', sm: 'row' }}
          >
            <Text fw={700} fz={'lg'} lh={'xl'}>
              My Tenders
            </Text>
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

export default MyTendersLayout;
