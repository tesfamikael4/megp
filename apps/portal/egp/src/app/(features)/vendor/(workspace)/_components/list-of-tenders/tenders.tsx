'use client';

import TenderCard from '@/app/(features)/_components/tender-card';
import { Box, Flex, Input, Select, SimpleGrid, Text } from '@mantine/core';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import styles from '../../_styles/mytenders.module.scss';

type TendersProps = {
  title: string;
};

export default function Tenders({ title }: TendersProps) {
  return (
    <main className={styles.main}>
      <Box>
        <Flex
          align={'center'}
          justify={'space-between'}
          mb={{ base: 'md', sm: 'md' }}
          gap={4}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Text fw={700}>{title}</Text>
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
  );
}
