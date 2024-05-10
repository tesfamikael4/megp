'use client';

import { DetailTable } from '@/app/(features)/_components/detail-table';
import { bidders } from '@/app/(features)/evaluation/_constants/data';
import { TenderOverView } from '@/app/(features)/opening/_components/tender-overview';
import { ActionIcon, Button, Box, Badge } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';

export default function BidOpening() {
  const router = useRouter();
  const { tenderId, itemId } = useParams();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    expandedRowContent: (record) => <DetailTender tender={record} />,
    columns: [
      {
        accessor: 'name',
        sortable: true,
      },
      {
        accessor: 'email',
        sortable: true,
        with: 100,
      },
      {
        accessor: 'status',
        width: 150,
        render: (record) => {
          //   const color =
          //     record.status === 'Opened'
          //       ? 'green'
          //       : record.status === 'Key not shared'
          //         ? 'red'
          //         : 'yellow';
          return (
            <Badge color="gray" variant="outline" size="xs">
              Not Evaluated Yet
              {/* <Badge color={color} size="sm">
              {record.status} */}
            </Badge>
          );
        },
      },
      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/evaluation/lots/${tenderId}/responsivness/${itemId}/${record.id}`,
              );
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 70,
      },
    ],
  };
  return (
    <>
      <TenderOverView basePath="" />
      <Section
        title="Bidders List"
        collapsible={false}
        className="mt-2"
        action={<Button>Complete</Button>}
      >
        <ExpandableTable
          config={config}
          data={bidders ?? []}
          total={bidders?.length}
        />
      </Section>
    </>
  );
}

const DetailTender = ({ tender }: any) => {
  const data = [
    {
      key: 'Name',
      value: tender.name,
    },

    {
      key: 'Email',
      value: tender.email,
    },
    {
      key: 'Phone',
      value: tender.phone,
    },
    {
      key: 'Status',
      value: 'Not Evaluated Yet',
    },
  ];

  return (
    <Box className="bg-white p-2">
      <DetailTable data={data} />
    </Box>
  );
};
