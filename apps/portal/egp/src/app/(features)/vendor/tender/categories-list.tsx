import React, { useState } from 'react';
import {
  TextInput,
  Text,
  UnstyledButton,
  Group,
  Divider,
  rem,
  Box,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { mockCategories } from './data'; // Importing the mockCategories data

const links = [
  { label: 'Latest Tenders' },
  { label: 'Last Offers' },
  { label: 'Registered Tenders' },
  { label: 'Saved Tenders' },
  { label: 'Withdrawn Tenders' },
  { label: 'Canceled Tenders' },
];

const collectionLinks = (links) =>
  links.map((category) => (
    <div key={category.id} className="mb-2">
      <UnstyledButton className="text-sm text-black">
        <Text fz={'1rem'} fw={400} lh={'30px'} className="hover:text-green-500">
          {category.name}
        </Text>
      </UnstyledButton>
    </div>
  ));

const MenuGroups = ({ title, links }) => {
  return (
    <Box className="mb-4 ">
      <Text className="text-gray-500 w-full uppercase mt-4 text-[20px] font-[500]">
        {title}
      </Text>
      <Divider size={2} className="mb-4" />
      <Box className="text-sm text-[16px] font-[400] ">
        {collectionLinks(links)}
      </Box>
    </Box>
  );
};

export function Categories() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCategories = mockCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const mainLinks = links.map((link) => (
    <div key={link.label} className="mb-2">
      <UnstyledButton className="text-sm text-black">
        <Text
          fz={'1rem'}
          fw={400}
          lh={'30px'}
          className="hover:text-green-500 "
        >
          {link.label}
        </Text>
      </UnstyledButton>
    </div>
  ));

  return (
    <Box
      className="bg-white p-4 flex flex-col justify-center justify-items-center"
      style={{ backgroundColor: '#f5fbfe' }}
    >
      <Box className="mb-4">
        <Text className="text-gray-500 w-full uppercase mt-4 text-[20px] font-[500]">
          Categories
        </Text>
        <Divider size={2} className="" />
      </Box>

      <TextInput
        placeholder="Search by categories"
        size="xs"
        leftSection={
          <IconSearch
            style={{ width: rem(12), height: rem(12) }}
            stroke={1.5}
          />
        }
        rightSectionWidth={70}
        styles={{ section: { pointerEvents: 'none' } }}
        mb="sm"
        value={searchTerm}
        onChange={handleSearch}
      />

      <Box className="mb-4">
        <Box className="flex flex-col ">{mainLinks}</Box>
      </Box>
      <MenuGroups title="Categories" links={filteredCategories} />
    </Box>
  );
}
