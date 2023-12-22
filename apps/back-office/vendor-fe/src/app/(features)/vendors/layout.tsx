'use client';

import { Box, Flex, Tabs } from '@mantine/core';
import React, { useState, useEffect, useCallback } from 'react';
import Entity from './Entity';
import {
  useGetVendorsQuery,
  useLazyGetRejectedVendorListQuery,
  useLazyGetVendorsQuery,
} from '@/store/api/vendor_request_handler/approved-rejected-api';
import { CollectionQuery, Where } from '@megp/entity';
import VendorFilterSidebar from '../_components/approved-sidebar';

const Vendors = ({ children }: { children: React.ReactElement }) => {
  const [filter, setFilter] = useState({
    businessType: '',
    name: '',
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
    setQuery({ take: 15, skip: 0 });
    setFilter({ name: '', businessType: '' });
  };
  useEffect(() => {
    if (!filter.name && !filter.businessType) {
      if (activeTab === 'approved') getFilteredList({ take: 15, skip: 0 });
      else getRejectedVendorList({ take: 15, skip: 0 });
    } else {
      if (activeTab === 'approved') {
        handleFilter(query, activeTab);
      } else if (activeTab === 'rejected') handleFilter(query, activeTab);
    }
  }, [filter.name, filter.businessType, activeTab]);

  const handleFilter = (
    filterInfo: any = { where: [[]] },
    status: 'approved' | 'rejected' = activeTab,
  ) => {
    const filters: Where[] = [];
    if (filter.name) {
      filters.push({
        column: 'name',
        operator: 'LIKE',
        value: `%${filter.name}%`,
      });
    }

    if (filter.businessType) {
      filters.push({
        column: 'country',
        operator: 'LIKE',
        value: `%${filter.businessType}%`,
      });
    }

    const query = { ...filterInfo, where: [filters] };

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
            title="Approved Vendors"
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
            title="Rejected Vendors"
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
