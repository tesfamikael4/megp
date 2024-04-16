'use client';
import {
  Box,
  Container,
  Flex,
  Pagination,
  SimpleGrid,
  Text,
} from '@mantine/core';
import React from 'react';
import HeaderNav from '../header-nav-bar';
import TenderCard from '../../../my-tenders/_components/tender-card';
const GridDisplay = () => {
  const { data, isLoading } = (() => ({
    data: Array.from({ length: 6 }), // Empty array for now
    isLoading: false,
  }))();
  return (
    <Container fluid p={0} className="flex flex-col gap-3 w-full">
      <HeaderNav />
      <SimpleGrid
        mt={{ base: 10, sm: 20 }}
        cols={{ base: 1, sm: 2, md: 2, lg: 2 }}
      >
        {data.map((_, index) => (
          <TenderCard key={index} color={'orange'} textColor="white" />
        ))}
      </SimpleGrid>
      <Flex className="w-full justify-end items-center mb-24 ">
        <Flex className="p-2 bg-white rounded-md shadow-sm">
          <Pagination total={5} />
        </Flex>
      </Flex>
    </Container>
  );
};

export default GridDisplay;
