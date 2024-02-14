'use client';

import { ActionIcon, Box, Button, Container, Tabs } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ExpandableTable } from '../_components/expandable-table';
import { useLazyListQuery } from './_api/tender.api';

const tenderList = [
  {
    title: 'Office Furniture',
    pr: 'Annual Procurement requisition',
    budget: 345,
    id: 'ec361463-c979-44ae-8faf-c506e7f51540',
    opening_date: '02/05/2024',
    closing_date: '02/05/2024',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
  },
];

export default function Preparation() {
  const [trigger, { data, isFetching }] = useLazyListQuery();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'title', title: 'Name', width: 200 },
      { accessor: 'pr', title: 'Procurement Requisition', width: 200 },
      { accessor: 'budget', title: 'Budget' },
      { accessor: 'opening_date', title: 'Opening Date' },
      { accessor: 'closing_date', title: 'Closing Date' },
      { accessor: 'isFetching', title: 'Description' },
      {
        accessor: 'id',
        title: '',
        render: (pr) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/preparation/${pr.id}`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    primaryColumn: 'title',
    isFetching: isFetching,
    expandedRowContent: () => {
      return <div>hello</div>;
    },
  };
  const onRequestChange = (request: any) => {
    trigger(request);
  };
  return (
    <Section title="Tenders" collapsible={false}>
      <Box className="">
        <ExpandableTable
          config={config}
          data={data?.items ?? tenderList}
          total={data?.total ?? 1}
          onRequestChange={onRequestChange}
        />
      </Box>
    </Section>
  );
}
