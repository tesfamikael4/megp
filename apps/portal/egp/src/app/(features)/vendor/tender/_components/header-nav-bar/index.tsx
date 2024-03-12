import { ActionIcon, Flex, Input, Text, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import Sort from './sort';
import { IconSearch } from '@tabler/icons-react';

type Props = {};

const HeaderNav = (props: Props) => {
  const [sortBy, setSortBy] = useState('asc');
  return (
    <Flex
      align={'center'}
      justify={'space-between'}
      gap={4}
      direction={{ base: 'column', sm: 'row' }}
      className="border border-b p-4 rounded-md bg-white"
    >
      <Text> All Tenders</Text>

      <Flex align={'end'} justify={{ base: 'center', sm: 'flex-end' }}>
        <TextInput
          size="xs"
          placeholder="Search Tenders Here"
          rightSection={
            <ActionIcon>
              <IconSearch size={18} />
            </ActionIcon>
          }
          className="flex-grow bg-[#f5fbfe]"
        />
        <Flex
          ml={'sm'}
          className="w-fit border-b border-[var(--mantine-color-primary-filled)]"
          align={'center'}
        >
          <Sort sortBy={sortBy} setSortBy={setSortBy} id={1} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HeaderNav;
