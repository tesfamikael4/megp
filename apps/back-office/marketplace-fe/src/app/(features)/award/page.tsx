'use client';

import { ActionIcon, Box } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ExpandableTable } from '@megp/core-fe';
import RFXDetail from '../rfx/_components/configuration/rfx-detail';
import {
  useLazyListRfxOnAwardQuery,
  useLazyListRfxOnReviewQuery,
} from '@/store/api/rfx/rfx.api';
import { useLazyListQuery } from '../rfx/_api/rfx/rfx.api';
import RFXHeader from '../assignment/_components/rfx-header';

export default function Award() {
  const [trigger, { data, isFetching }] = useLazyListRfxOnAwardQuery();
  //   const [trigger, { data, isFetching }] = useLazyListQuery();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 200 },
      {
        accessor: 'procurementReferenceNumber',
        title: 'Reference Number',
        width: 200,
      },
      { accessor: 'budgetAmount', title: 'Budget Amount' },
      { accessor: 'budgetCode', title: 'Budget Code' },
      {
        accessor: 'id',
        title: '',
        render: (rfx) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/award/${rfx.id}`);
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
    trigger(request);
  };

  return (
    <Section title="Awarded RFQs" collapsible={false}>
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
