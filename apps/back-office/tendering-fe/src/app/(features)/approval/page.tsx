'use client';

import { ActionIcon, Box, Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ExpandableTable } from '../_components/expandable-table';
import { TenderStatusEnum } from '@/models/tender/tender.model';
import TenderDetail from './_components/tender-detail';
import { useLazyListQuery } from './_api/tender/tender.api';

export default function Approval() {
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
              router.push(`/approval/${tender.id}?tab=document`);
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
    trigger({
      ...request,
      where: [
        [
          {
            column: 'status',
            value: TenderStatusEnum.APPROVAL,
            operator: '=',
          },
        ],
      ],
    });
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
