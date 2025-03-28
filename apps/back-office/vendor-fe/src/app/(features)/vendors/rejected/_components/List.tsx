'use client';

import { Box, Flex } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import Entity from './Entity';
import { CollectionQuery, Where } from '@megp/entity';
import VendorFilterSidebar from '@/app/(features)/_components/approved-sidebar';

const ApplicationList = ({
  children,
  listOfItems,
  isLoading,
  title,
  getFilteredList,
}: {
  children: React.ReactElement;
  listOfItems: { items: any[]; total: number };
  isLoading: boolean;
  title: string;
  getFilteredList: (query: CollectionQuery) => void;
}) => {
  const [filter, setFilter] = useState({
    businessType: '',
    name: '',
    country: '',
    serviceName: '',
    status: '',
  });

  // this will handle fetch when all the filter fields are empty
  useEffect(() => {
    if (!filter.name && !filter.businessType) {
      handleFilter({ take: 15, skip: 0 });
    }
  }, [filter.name, filter.businessType]);

  const handleFilter = (filterInfo: any = { where: [[]] }) => {
    const filters: Where[][] = [];
    if (filter.name) {
      filters.push([
        {
          column: 'isrVendor.basic->>name',
          operator: 'ILIKE',
          value: `${filter.name}`,
        },
      ]);
    }

    if (filter.businessType) {
      filters.push([
        {
          column: 'isrVendor.basic->>businessType',
          operator: 'LIKE',
          value: `${filter.businessType}`,
        },
      ]);
    }
    if (filter.country) {
      filters.push([
        {
          column: 'isrVendor.basic->>origin',
          operator: 'LIKE',
          value: `${filter.country}`,
        },
      ]);
    }
    if (filter.serviceName) {
      filters.push([
        {
          column: 'BpService.name',
          operator: 'LIKE',
          value: `${filter.serviceName}`,
        },
      ]);
    }
    if (filter.status) {
      filters.push([
        {
          column: 'status',
          operator: 'LIKE',
          value: `${filter.status}`,
        },
      ]);
    }

    const query: CollectionQuery = {
      ...filterInfo,
      where: [...filters],
    };

    getFilteredList(query);
  };

  return (
    <Flex direction="row" gap="sm">
      <Box className="w-4/6">
        <Entity
          list={listOfItems ?? { items: [], total: 0 }}
          isLoading={isLoading}
          title={title}
          onRequestChange={(query: CollectionQuery) => {
            handleFilter(query);
          }}
        >
          {children}
        </Entity>
      </Box>
      <Box className="w-2/6">
        <VendorFilterSidebar
          filter={filter}
          setFilter={setFilter}
          handleFilter={handleFilter}
          isRejected={true}
        />
      </Box>
    </Flex>
  );
};

export default ApplicationList;
