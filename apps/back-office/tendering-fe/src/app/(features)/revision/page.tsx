'use client';

import { ActionIcon, Box, Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ExpandableTable } from '../_components/expandable-table';
import { useLazyListTendersQuery } from './_api/tender.api';
import { CollectionQuery } from '@megp/entity';
import { TenderStatusEnum } from '@/models/tender/tender.model';

export default function Revision() {
  const [trigger, { data, isFetching }] = useLazyListTendersQuery();
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

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      ...request,
      where: [
        [
          {
            column: 'status',
            value: TenderStatusEnum.SENT_FOR_REVIEW,
            operator: '=',
          },
        ],
      ],
    });
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
