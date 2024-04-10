'use client';

import { ActionIcon, Box } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { DetailTable } from '../_components/detail-table';
import { useRouter } from 'next/navigation';
import { useLazyGetClosedTendersQuery } from '@/store/api/tendering/tendering.api';

export default function Administration() {
  const router = useRouter();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    expandedRowContent: (record) => <DetailTender tender={record} />,
    columns: [
      {
        accessor: 'procurementReferenceNumber',
        title: '#Ref',
        width: 100,
        sortable: true,
      },
      {
        accessor: 'name',
        width: 250,
        sortable: true,
      },
      {
        accessor: 'procurementCategory',
        width: 150,
        sortable: true,
      },

      {
        accessor: 'status',
        width: 100,
        sortable: true,
      },
      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/administration/${record.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 30,
      },
    ],
  };

  //rtk
  const [getClosedTenders, { data: tenders }] = useLazyGetClosedTendersQuery();
  return (
    <Section title="Tenders List (Opening)" collapsible={false}>
      <ExpandableTable
        config={config}
        data={tenders?.items ?? []}
        total={tenders?.total ?? 0}
        onRequestChange={(collectionQuery) => {
          getClosedTenders({ collectionQuery });
        }}
      />
    </Section>
  );
}

const DetailTender = ({ tender }: any) => {
  const data = [
    {
      key: 'Reference',
      value: tender.procurementReferenceNumber,
    },
    {
      key: 'Name',
      value: tender.name,
    },
    {
      key: 'Procurement Category ',
      value: tender.procurementCategory,
    },
    {
      key: 'Budget Amount',
      value: tender.budgetAmount.toLocaleString('en-US', {
        style: 'currency',
        currency: tender.budgetAmountCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    {
      key: 'Market Estimate',
      value: tender.marketEstimate.toLocaleString('en-US', {
        style: 'currency',
        currency: tender.marketEstimateCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    {
      key: 'Status',
      value: tender.status,
    },
  ];

  return (
    <Box className="bg-white p-2">
      <DetailTable data={data} />
    </Box>
  );
};
