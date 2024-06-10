'use client';

import { ActionIcon, Box, Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ExpandableTable } from '@megp/core-fe';
import { useLazyListQuery } from '../rfx/_api/rfx/rfx.api';
import RFXDetail from '../rfx/_components/configuration/rfx-detail';

export default function Revision() {
  const [trigger, { data, isFetching }] = useLazyListQuery();
  const router = useRouter();

  useEffect(() => {
    trigger({
      where: [
        [
          {
            column: 'status',
            value: 'SUBMITTED_EVALUATION',
            operator: '=',
          },
        ],
      ],
    });
  }, []);

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 200 },
      {
        accessor: 'procurementReferenceNumber',
        title: 'Ref No',
        width: 200,
      },
      { accessor: 'budgetAmount', title: 'Budget Amount' },
      { accessor: 'budgetCode', title: 'Budget Code' },
      { accessor: 'status', title: 'Status' },
      {
        accessor: 'id',
        title: '',
        render: (rfx) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/evaluation-approval/${rfx.id}`);
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
    primaryColumn: 'name',
    isFetching: isFetching,
    expandedRowContent: (rfx) => {
      return <RFXDetail rfx={rfx} />;
    },
  };

  const onRequestChange = (request: any) => {
    trigger(request);
  };

  return (
    <Section title="RFQ Evaluations Submitted For Approval" collapsible={false}>
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
