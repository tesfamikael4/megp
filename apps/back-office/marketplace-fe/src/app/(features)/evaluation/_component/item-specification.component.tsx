'use client';
import { useLazyGetItemSpecificationEvalQuery } from '@/store/api/rfx/rfx.api';
import { ActionIcon, Box, Paper, Stack, Text } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { DetailTable } from '../../rfx/_components/detail-table';

export default function ItemSpecification() {
  const [getItemSpec, { data: itemSpec, isLoading: isFetching }] =
    useLazyGetItemSpecificationEvalQuery();
  const { bidderId } = useParams();

  const config = {
    columns: [
      {
        accessor: 'name',
        title: 'Description',
        render: (value) => <>{value?.rfxItem?.name}</>,
      },
      {
        accessor: 'price',
        render: (value) => (
          <>
            {parseInt(value?.price).toLocaleString('en-US', {
              style: 'currency',
              currency: value?.currency ?? 'MKW',
            })}
          </>
        ),
      },
    ],
    isExpandable: true,
    isSearchable: false,
    primaryColumn: 'name',
    isLoading: isFetching,
    expandedRowContent: (itemSpec) => {
      return (
        <ItemDetailSpec
          itemSpec={
            itemSpec?.rfxItem?.technicalRequirement?.technicalSpecification
          }
        />
      );
    },
  };

  useEffect(() => {
    getItemSpec({ bidderId: bidderId?.toString() });
  }, [bidderId]);
  return (
    <Section title="Item Details " collapsible={false}>
      <Box className="">
        <ExpandableTable config={config} data={itemSpec ?? []} total={0} />
      </Box>
    </Section>
  );
}

const ItemDetailSpec = ({ itemSpec }: any) => {
  const specificationDetails = Object.entries(itemSpec || {})
    .filter(([key]) => key !== 'url')
    .map(([key, value]) => ({
      key: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
      value: value ?? '',
    }));
  return <DetailTable data={specificationDetails as any} />;
};
