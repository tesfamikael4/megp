'use client';

import { ActionIcon, Box } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { ExpandableTable } from '@megp/core-fe';
import { useLazyListQuery } from '../rfx/_api/rfx/rfx.api';
import RFXDetail from '../rfx/_components/configuration/rfx-detail';

export default function Preparation() {
  const [trigger, { data, isFetching }] = useLazyListQuery();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 200 },
      {
        accessor: 'procurementReferenceNumber',
        title: 'Ref',
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
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/assignment/${rfx.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    primaryColumn: 'name',
    isLoading: isFetching,
    expandedRowContent: (rfx) => {
      return <RFXDetail rfx={rfx} />;
    },
  };

  const onRequestChange = (request: any) => {
    trigger({
      ...request,
      where: [[{ column: 'status', operator: '=', value: 'EVALUATION' }]],
    });
  };
  return (
    <Section title="RFQs (Evaluation Team Assignment)" collapsible={false}>
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
