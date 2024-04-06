'use client';

import { ActionIcon, Box, Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ExpandableTable } from '../_components/expandable-table';
import { useLazyListQuery } from './_api/tender.api';

export default function Preparation() {
  const [trigger, { data, isFetching }] = useLazyListQuery();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 200 },
      {
        accessor: 'procurementReferenceNumber',
        title: 'Procurement Reference Number',
        width: 200,
      },
      { accessor: 'budgetAmount', title: 'Budget Amount' },
      { accessor: 'budgetCode', title: 'Budget Code' },
      { accessor: 'status', title: 'Status' },
      {
        accessor: 'id',
        title: '',
        render: (tender) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/revision/${tender.id}`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    primaryColumn: 'title',
    isFetching: isFetching,
  };

  const onRequestChange = (request: any) => {
    trigger(request);
  };
  return (
    <Section title="Tenders" collapsible={false}>
      <Box className="">
        <ExpandableTable
          config={config}
          data={data?.items ?? []}
          total={data?.total ?? 0}
          onRequestChange={onRequestChange}
        />
      </Box>
    </Section>
  );
}
