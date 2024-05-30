import { Flex, Box } from '@mantine/core';
import { CollectionQuery, Where } from '@megp/entity';
import {
  useState,
  useEffect,
  ReactElement,
  JSXElementConstructor,
} from 'react';
import Entity from '../_components/Entity';
import VendorFilterSidebar from '../_components/vendor-list-sidebar';
import { useLazyGetVendorsQuery } from '../../_api/reports';
import { usePathname } from 'next/navigation';

const VendorListPage = ({
  children,
}: {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}) => {
  const [getFilteredList, { data: list, isLoading: isVendorListLoading }] =
    useLazyGetVendorsQuery();

  return (
    <>
      <VendorsListWithFilter
        listOfItems={list ?? { items: [], total: 0 }}
        isLoading={isVendorListLoading}
        getFilteredList={getFilteredList}
      >
        {children}
      </VendorsListWithFilter>
    </>
  );
};

export default VendorListPage;
const VendorsListWithFilter = ({
  children,
  listOfItems,
  isLoading,
  getFilteredList,
}: {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  listOfItems: { items: any[]; total: number };
  isLoading: boolean;
  getFilteredList: (query: CollectionQuery) => void;
}) => {
  const pathname = usePathname();
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

    const query = {
      ...filterInfo,
      where: [...(filterInfo?.where ?? []), ...filters],
    };

    getFilteredList(query);
  };

  const mode = pathname == '/vendors' ? 'list' : 'detail';
  console.log(mode);
  return (
    <Flex direction="row" gap="sm" py={20}>
      <Box className={`${mode === 'detail' ? 'w-full' : 'w-4/6'}`}>
        <Entity
          list={listOfItems ?? { items: [], total: 0 }}
          isLoading={isLoading}
          onRequestChange={(query: CollectionQuery) => {
            handleFilter(query);
          }}
          isSearchable={mode === 'detail'}
        >
          {children}
        </Entity>
      </Box>
      {mode !== 'detail' && (
        <Box className="w-2/6">
          <VendorFilterSidebar
            filter={filter}
            setFilter={setFilter}
            handleFilter={handleFilter}
          />
        </Box>
      )}
    </Flex>
  );
};
