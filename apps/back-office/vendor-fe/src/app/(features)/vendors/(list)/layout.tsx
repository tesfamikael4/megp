'use client';

import { Box, Flex, Tabs } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import Entity from './Entity';
import {
  useLazyGetRejectedVendorListQuery,
  useLazyGetVendorsQuery,
} from '@/store/api/vendor_request_handler/approved-rejected-api';
import { CollectionQuery, Where } from '@megp/entity';
import VendorFilterSidebar from '../../_components/approved-sidebar';

const Vendors = ({ children }: { children: React.ReactElement }) => {
  const [filter, setFilter] = useState({
    businessType: '',
    name: '',
    country: '',
  });
  const [query, setQuery] = useState<CollectionQuery>({});
  const [activeTab, setActiveTab] = useState<'approved' | 'rejected'>(
    'approved',
  );
  const [getFilteredList, { data: filteredList, isLoading }] =
    useLazyGetVendorsQuery();
  const [getRejectedVendorList, { data: rejectedVendorList = [] }] =
    useLazyGetRejectedVendorListQuery();

  const handleTabChange = (tab: 'approved' | 'rejected') => {
    setActiveTab(tab);
    setFilter({ name: '', businessType: '', country: '' });

    // console.log(query)
    if (tab === 'approved') {
      handleFilter(query, tab);
    } else if (tab === 'rejected') handleFilter(query, tab);
  };

  // this will handle fetch when all the filter fields are empty
  useEffect(() => {
    if (!filter.name && !filter.businessType) {
      handleFilter({ take: 15, skip: 0 }, activeTab);
    }
  }, [filter.name, filter.businessType, activeTab]);

  const handleFilter = (
    filterInfo: any = { where: [[]] },
    status: 'approved' | 'rejected' = activeTab,
  ) => {
    const filters: Where[][] = [];
    if (filter.name) {
      filters.push([
        {
          column: 'name',
          operator: 'LIKE',
          value: `%${filter.name}%`,
        },
      ]);
    }

    if (filter.businessType) {
      filters.push([
        {
          column: 'country',
          operator: 'LIKE',
          value: `%${filter.businessType}%`,
        },
      ]);
    }

    if (filter.country) {
      filters.push([
        {
          column: 'origin',
          operator: 'LIKE',
          value: `${filter.country}`,
        },
      ]);
    }

    const query = { ...filterInfo, where: [...filters] };

    if (status === 'approved') {
      getFilteredList(query);
    } else if (status === 'rejected') getRejectedVendorList(query);
  };

  return (
    <Flex direction="row" gap="sm">
      <Tabs
        defaultValue={'approved'}
        value={activeTab}
        onChange={handleTabChange}
        className="w-4/6"
      >
        <Tabs.List className="bg-white h-14">
          <Tabs.Tab value="approved">Approved Vendors</Tabs.Tab>
          <Tabs.Tab value="rejected">Rejected Applications</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="approved">
          <Entity
            list={filteredList ?? { items: [], total: 0 }}
            isLoading={isLoading}
            title="approved"
            onRequestChange={(query: CollectionQuery) => {
              setQuery(query);
              handleFilter(query);
            }}
          >
            {children}
          </Entity>
        </Tabs.Panel>
        <Tabs.Panel value="rejected">
          <Entity
            list={rejectedVendorList ?? { items: [], total: 0 }}
            isLoading={isLoading}
            title="rejected"
            onRequestChange={(query: CollectionQuery) => {
              setQuery(query);
              handleFilter(query);
            }}
          >
            {children}
          </Entity>
        </Tabs.Panel>
      </Tabs>
      <Box className="w-2/6">
        <VendorFilterSidebar
          filter={filter}
          setFilter={setFilter}
          handleFilter={handleFilter}
        />
      </Box>
    </Flex>
  );
};

export default Vendors;
