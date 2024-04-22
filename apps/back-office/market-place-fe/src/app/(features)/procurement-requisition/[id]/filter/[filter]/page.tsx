'use client';
import { useLazyGetCatalogueItemsQuery } from '@/store/api/rfx/rfx.api';
import { Flex, LoadingOverlay, Pagination, Paper } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

const perPage = 10;

export default function Filter() {
  const [
    getCatalogueItems,
    { data: catalogueItems, isLoading: isGettingCatalogue },
  ] = useLazyGetCatalogueItemsQuery();
  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(catalogueItems?.total ?? 0, perPage);
  // const [search, setSearch] = useDebouncedState('', 500);

  useEffect(() => {
    const from = (page - 1) * perPage;
    getCatalogueItems({
      skip: from,
      take: perPage,
      orderBy: [
        {
          column: 'createdAt',
          direction: 'DESC',
        },
      ],
      where: [
        [
          {
            column: `specification->>RAM`,
            operator: '=',
            value: '16GB DDR4',
          },
        ],
        [
          {
            column: `specification->>batteryLife`,
            operator: '=',
            value: 'Up to 9 hours',
          },
        ],
      ],
    });
  }, [page]);

  return (
    <Flex>
      <Paper className="w-1/3">
        <LoadingOverlay visible={isGettingCatalogue} />
        {catalogueItems?.items}
      </Paper>
      <Pagination
        onChange={setPage}
        size="sm"
        total={totalPages}
        value={page}
        withEdges
      />
    </Flex>
  );
}
