'use client';

import { ActionIcon, Box } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { DetailTable } from '../_components/detail-table';
import { useRouter } from 'next/navigation';
import { useLazyGetOpenedTendersQuery } from '@/store/api/tendering/tendering.api';

export default function BidEvaluation() {
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
  const [getOpenedTenders, { data: tenders }] = useLazyGetOpenedTendersQuery();
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
      value: tender.reference,
    },
    {
      key: 'Name',
      value: tender.name,
    },
    {
      key: 'Envelope',
      value: tender.envelope,
    },
    {
      key: 'Bid',
      value: tender.bid,
    },
    {
      key: 'Evaluation Method',
      value: tender.evaluationMethod,
    },
    {
      key: 'Milestone',
      value: tender.milestone,
    },
  ];

  return (
    <Box className="bg-white p-2">
      <DetailTable data={data} />
    </Box>
  );
};
