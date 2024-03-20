'use client';

import { ActionIcon, Box } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { DetailTable } from '../_components/detail-table';
import { useRouter } from 'next/navigation';
import { data } from '../opening/_constants/data';

export default function BidOpening() {
  const router = useRouter();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    expandedRowContent: (record) => <DetailTender tender={record} />,
    columns: [
      {
        accessor: 'reference',
        title: '#Ref',
        width: 100,
        sortable: true,
      },
      {
        accessor: 'name',
        width: 150,
        sortable: true,
      },
      {
        accessor: 'envelope',
        width: 100,
        sortable: true,
      },
      {
        accessor: 'bid',
        width: 100,
        sortable: true,
      },
      {
        accessor: 'evaluationMethod',
        width: 100,
        sortable: true,
      },
      {
        accessor: 'milestone',
        width: 150,
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
  return (
    <Section title="Tenders List" collapsible={false}>
      <ExpandableTable config={config} data={data ?? []} total={data?.length} />
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
