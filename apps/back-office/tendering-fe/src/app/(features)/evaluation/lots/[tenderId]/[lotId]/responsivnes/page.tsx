'use client';

import { items } from '@/app/(features)/evaluation/_constants/data';
import { TenderOverView } from '@/app/(features)/opening/[id]/_components/tender-overview';
import { ActionIcon, Badge, Box, Text } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';

export default function Items() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    expandedRowContent: (record) => <DetailTender tender={record} />,
    columns: [
      {
        accessor: 'description',
        width: 400,
        sortable: true,
      },
      {
        accessor: 'commodityName',
        title: 'classification',
        sortable: true,
      },
      {
        accessor: 'itemSubcategoryName',
        title: 'Item Category',
        sortable: true,
      },
      {
        accessor: 'status',
        sortable: true,
        render: () => (
          <Badge color="gray" variant="outline" size="xs">
            Not Evaluated Yet
          </Badge>
        ),
      },

      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/evaluation/lots/${tenderId}/${lotId}/responsivnes/${record.id}`,
              );
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        // width: 10,
      },
    ],
  };
  return (
    <>
      <TenderOverView />
      <Section title="Items" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={items ?? []}
          total={items?.length}
        />
      </Section>
    </>
  );
}

const DetailTender = ({ tender }: any) => {
  const config: ExpandableTableConfig = {
    columns: [
      {
        accessor: 'name',
      },
      {
        accessor: 'email',
      },
      {
        accessor: 'phone',
      },
    ],
  };

  return (
    <Box className="bg-white p-5">
      {/* <DetailTable data={data} /> */}
      <Text fw={500}>Bidders List</Text>
      <ExpandableTable config={config} data={[]} />
    </Box>
  );
};
