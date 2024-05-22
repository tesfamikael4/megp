import { Flex, Box } from '@mantine/core';
import { CollectionQuery, Where } from '@megp/entity';
import { useState, useEffect } from 'react';
import Entity from '../_components/Entity';
import VendorFilterSidebar from '../_components/vendor-list-sidebar';
import { useLazyGetVendorsQuery } from '../../_api/reports';

const VendorListPage = () => {
  const [getFilteredList, { data: list, isLoading: isVendorListLoading }] =
    useLazyGetVendorsQuery();

  return (
    <>
      <VendorsListWithFilter
        listOfItems={list ?? { items: [], total: 0 }}
        isLoading={isVendorListLoading}
        getFilteredList={getFilteredList}
      />
    </>
  );
};

export default VendorListPage;
const VendorsListWithFilter = ({
  listOfItems,
  isLoading,
  getFilteredList,
}: {
  listOfItems: { items: any[]; total: number };
  isLoading: boolean;
  getFilteredList: (query: CollectionQuery) => void;
}) => {
  const [filter, setFilter] = useState({
    businessType: '',
    name: '',
    country: '',
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
          column: 'name',
          operator: 'ILIKE',
          value: `${filter.name}`,
        },
      ]);
    }

    if (filter.businessType) {
      filters.push([
        {
          column: 'formOfEntity',
          operator: 'LIKE',
          value: `${filter.businessType}`,
        },
      ]);
    }
    if (filter.country) {
      filters.push([
        {
          column: 'countryOfRegistration',
          operator: 'LIKE',
          value: `${filter.country}`,
        },
      ]);
    }

    const query = { ...filterInfo, where: [...filters] };

    getFilteredList(query);
  };

  return (
    <Flex direction="row" gap="sm" py={20}>
      <Box className="w-4/6">
        <Entity
          list={listOfItems ?? { items: [], total: 0 }}
          isLoading={isLoading}
          onRequestChange={(query: CollectionQuery) => {
            handleFilter(query);
          }}
        >
          <></>
        </Entity>
      </Box>
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
