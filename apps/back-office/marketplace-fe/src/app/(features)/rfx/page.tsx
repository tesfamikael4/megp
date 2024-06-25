'use client';

import { ActionIcon, Box, Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ExpandableTable } from '@megp/core-fe';
import { useLazyListQuery } from './_api/rfx/rfx.api';
import RFXDetail from './_components/configuration/rfx-detail';
import { useLazyListRfxsQuery } from '@/store/api/rfx/rfx.api';

export default function Preparation() {
  const [trigger, { data, isFetching }] = useLazyListRfxsQuery();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 200 },
      {
        accessor: 'procurementReferenceNumber',
        title: 'Reference Number',
        width: 200,
      },
      {
        accessor: 'budgetAmount',
        title: 'Budget Amount',
        render: (rfx) => (
          <>
            {parseInt(rfx.budgetAmount).toLocaleString('en-US', {
              style: 'currency',
              currency: rfx?.budgetAmountCurrency ?? 'MKW',
            })}
          </>
        ),
      },
      {
        accessor: 'procurementCategory',
      },
      {
        accessor: 'id',
        title: '',
        render: (rfx) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/rfx/${rfx.id}/configuration`);
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
    isLoading: isFetching,
    expandedRowContent: (rfx) => {
      return <RFXDetail rfx={rfx} />;
    },
  };

  const onRequestChange = (request: any) => {
    trigger({
      ...request,
      // where: [
      //   [{ column: 'status', operator: '=', value: 'DRAFT' }],
      //   [{ column: 'status', operator: '=', value: 'PENDING' }],
      // ],
    });
  };
  return (
    <Section
      title="RFQs"
      collapsible={false}
      action={
        <Button onClick={() => router.push(`rfx/new`)}>
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
