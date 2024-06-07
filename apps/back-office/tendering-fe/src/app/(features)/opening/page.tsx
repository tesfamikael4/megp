'use client';

import { ActionIcon, Box } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { DetailTable } from '../_components/detail-table';
import { useRouter } from 'next/navigation';
import { useLazyGetClosedTendersQuery } from '@/store/api/tendering/tender-opening.api';

export default function BidOpening() {
  const router = useRouter();
  const [getClosedTenders, { data: tenders, isLoading }] =
    useLazyGetClosedTendersQuery();
  const config: ExpandableTableConfig = {
    isLoading: isLoading,
    isSearchable: true,
    isExpandable: true,
    expandedRowContent: (record) => <DetailTender tender={record} />,
    columns: [
      {
        accessor: 'procurementReferenceNumber',
        title: 'Reference No',
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
              router.push(`/opening/${record.id}`);
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
      key: 'Reference No',
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
      value: parseFloat(tender.budgetAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: tender.budgetAmountCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      }),
    },
    {
      key: 'Market Estimate',
      value: parseFloat(tender.marketEstimate).toLocaleString('en-US', {
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
