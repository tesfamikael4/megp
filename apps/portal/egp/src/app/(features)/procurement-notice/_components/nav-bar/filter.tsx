import React, { useState } from 'react';
import {
  ActionIcon,
  Box,
  Divider,
  ScrollArea,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import Link from 'next/link';

export type FilteredQuery = {
  key: string;
  value: string;
}[];

export type FilterOptions = {
  key: string;
  value: string[];
};

const Filter = ({ filterOptions }: { filterOptions: FilterOptions }) => {
  const [query, setQuery] = useState('');
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      // Handle ArrowDown or ArrowUp key press
    }
  };

  const handleReset = () => {
    setQuery('');
  };

  return (
    <Box mt={10}>
      <Box className="mb-4">
        <Text fw={500} fz={16} color="gray.7">
          {filterOptions.key}
        </Text>
        <Divider size={2} className="" />
      </Box>
      <Box className={scrollPosition.y > 0 ? `shadow-md` : ``}>
        <TextInput
          size="xs"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          rightSection={
            query ? (
              <Tooltip label="remove" fz={12}>
                <ActionIcon variant="subtle" onClick={() => handleReset()}>
                  <IconX size={16} />
                </ActionIcon>
              </Tooltip>
            ) : null
          }
        />
      </Box>
      <ScrollArea mt="6" onScrollPositionChange={onScrollPositionChange}>
        {filterOptions.value
          .filter((value) =>
            value.toLowerCase().startsWith(query.toLowerCase()),
          )
          .map((v, index) => (
            <Link key={index} href={v.toLowerCase()}>
              <Text
                fz={13}
                fw={400}
                lh={'30px'}
                w={180}
                className="hover:text-green-500 "
                truncate
              >
                {v}
              </Text>
            </Link>
          ))}
      </ScrollArea>
    </Box>
  );
};

export default Filter;
