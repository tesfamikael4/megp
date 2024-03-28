'use client';

import { ActionIcon, Box, Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ExpandableTable } from '../_components/expandable-table';
import { useLazyListQuery } from './_api/tender/tender.api';
import TenderDetail from './_components/tender/tender-detail';

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
              router.push(`/preparation/${tender.id}?tab=configuration`);
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
    expandedRowContent: (tender) => {
      return <TenderDetail tender={tender} />;
    },
  };

  const onRequestChange = (request: any) => {
    trigger(request);
  };
  return (
    <Section
      title="Tenders"
      collapsible={false}
      action={
        <Button onClick={() => router.push(`preparation/new`)}>
          <IconPlus size={14} /> New
        </Button>
      }
    >
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
