import { Box, Divider, Text } from '@mantine/core';
import Filter, { FilteredQuery } from './filter';
import { useState } from 'react';
const filters = [
  {
    key: 'Category',
    value: [
      'Latest Tenders',
      'Last Offers',
      'Registered Tenders',
      'Saved Tenders',
      'Withdrawn Tenders',
      'Canceled Tenders',
    ],
  },

  {
    key: 'Type',
    value: ['Service', 'Goods', 'Works'],
  },
];
export default function Navbar() {
  return (
    <Box
      className="bg-white p-4 flex flex-col justify-center justify-items-center"
      style={{ backgroundColor: '#f5fbfe' }}
    >
      {filters.map((filters, key) => (
        <Filter key={key} filterOptions={filters} />
      ))}
    </Box>
  );
}
