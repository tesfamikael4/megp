'use client';

import { ActionIcon, Box } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { ExpandableTable } from '@megp/core-fe';
import RFXDetail from '../rfx/_components/configuration/rfx-detail';
import { useLazyListRfxOnEvaluationQuery } from '@/store/api/rfx/rfx.api';

export default function Evaluation() {
  const [trigger, { data, isFetching }] = useLazyListRfxOnEvaluationQuery();
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
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/evaluation/${rfx.id}/personal`);
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
    trigger(request);
  };
  return (
    <Section title="RFQs (Evaluation)" collapsible={false}>
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
