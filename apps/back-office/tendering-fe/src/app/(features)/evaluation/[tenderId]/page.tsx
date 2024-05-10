'use client';

import { ActionIcon, Box, Text } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { TenderOverView } from '@/app/(features)/opening/_components/tender-overview';
import { useLazyGetLotsByTenderIdQuery } from '@/store/api/tendering/tendering.api';

export default function BidOpening() {
  const router = useRouter();
  const { tenderId } = useParams();
  const [getLots, { data: lots }] = useLazyGetLotsByTenderIdQuery();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    expandedRowContent: (record) => <DetailTender tender={record} />,
    columns: [
      {
        accessor: 'name',
        width: 400,
        sortable: true,
      },
      {
        accessor: 'status',
        width: 50,
        sortable: true,
      },

      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/evaluation/${tenderId}/${record.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 10,
      },
    ],
  };
  return (
    <>
      <TenderOverView basePath="/evaluation" />
      <Section title="Lots List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={lots?.items ?? []}
          total={lots?.total ?? 0}
          onRequestChange={(request) => {
            getLots({
              tenderId,
              collectionQuery: request,
            });
          }}
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
