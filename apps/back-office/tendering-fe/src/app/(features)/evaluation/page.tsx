'use client';

import { ActionIcon, Box } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { DetailTable } from '../_components/detail-table';
import { useRouter } from 'next/navigation';
import { useLazyGetOpenedTendersQuery } from '@/store/api/tendering/preliminary-compliance.api';

export default function BidEvaluation() {
  const router = useRouter();
  const [getOpenedTenders, { data: tenders, isLoading }] =
    useLazyGetOpenedTendersQuery();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    isLoading: isLoading,
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
        accessor: 'milestone',
        width: 100,
        sortable: true,
        render: (record) => record.tenderMilestones[0].milestoneTxt ?? '',
      },
      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/evaluation/${record.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 30,
      },
    ],
  };

  return (
    <Section title="Tenders List (Evaluation)" collapsible={false}>
      <ExpandableTable
        config={config}
        data={tenders?.items ?? []}
        total={tenders?.total ?? 0}
        onRequestChange={(collectionQuery) => {
          getOpenedTenders({ collectionQuery });
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
