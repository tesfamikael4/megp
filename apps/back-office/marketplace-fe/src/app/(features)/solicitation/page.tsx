'use client';

import { Box } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { ExpandableTable } from '@megp/core-fe';
import RFXDetail from '../rfx/_components/configuration/rfx-detail';
import { useLazyGetSolicitationStatusQuery } from '@/store/api/rfx/rfx.api';

export default function Preparation() {
  const [trigger, { data, isFetching }] = useLazyGetSolicitationStatusQuery();

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
        accessor: 'solRegistrationCount',
        title: 'Vendors Participating',
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
    <Section title="RFQs (Solicitation Status)" collapsible={false}>
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
