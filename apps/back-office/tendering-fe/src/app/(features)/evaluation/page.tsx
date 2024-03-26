'use client';

import { ActionIcon, Box } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { data } from './_constants/data';
import { DetailTable } from '../_components/detail-table';
import { useRouter } from 'next/navigation';

export default function BidEvaluation() {
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
              if (record.id == '7daab8e2-0c59-49e7-ae12-bf537c5fde6d') {
                router.push(`/evaluation/lots/${record.id}/responsivness`);
              } else if (record.id == '4cde31ab-ebb5-4b9a-afc3-1a5b48238f69') {
                router.push(`/evaluation/lots/${record.id}/bid-price`);
              } else {
                router.push(`/evaluation/lots/${record.id}`);
              }
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
