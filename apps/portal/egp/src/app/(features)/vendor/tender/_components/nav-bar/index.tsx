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
    key: 'Organization',
    value: [
      'Malawi Country Ministry Offices',
      'Ministry of Agriculture, Irrigation, and Water Development - Agriculture, Irrigation, and Water Management',
      'Ministry of Education, Science, and Technology - Education, Science, and Technology Advancement',
      'Ministry of Health - Public Health and Healthcare Services',
      'Ministry of Finance, Economic Planning and Development - Financial Management and Economic Planning',
      'Ministry of Gender, Children, Disability, and Social Welfare - Gender Equality, Child Welfare, Disability Rights, and Social Welfare',
      'Ministry of Transport and Public Works - Transportation Infrastructure and Public Works',
      'Ministry of Natural Resources, Energy, and Mining - Natural Resource Management, Energy Production, and Mining',
      'Ministry of Industry, Trade, and Tourism - Industrial Development, Trade Promotion, and Tourism',
      'Ministry of Local Government and Rural Development - Local Governance and Rural Development',
      'Ministry of Justice and Constitutional Affairs - Legal Affairs, Justice, and Constitutional Governance',
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
