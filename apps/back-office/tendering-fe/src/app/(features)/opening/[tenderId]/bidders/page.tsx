'use client';

import { Button, Box, Badge } from '@mantine/core';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  notify,
} from '@megp/core-fe';
// import { bidders } from '../../_constants/data';
import { DetailTable } from '../../_components/detail-table';
import { TenderOverView } from '../../_components/tender-overview';
import { useParams, useRouter } from 'next/navigation';
import {
  useLazyGetAllbiddersByTenderIdQuery,
  useOpenTenderMutation,
} from '@/store/api/tendering/tendering.api';

export default function BidOpening() {
  const router = useRouter();
  const { tenderId } = useParams();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    expandedRowContent: (record) => <DetailTender tender={record} />,
    columns: [
      {
        accessor: 'bidderName',
        sortable: true,
      },

      {
        accessor: 'status',
        width: 150,
        render: (record) => {
          const color =
            record.status === 'Opened'
              ? 'green'
              : record.status === 'Key not shared'
                ? 'red'
                : 'yellow';
          return (
            <Badge color={color} size="sm">
              {record.status}
            </Badge>
          );
        },
      },
    ],
  };

  const [getBidders, { data: bidders }] = useLazyGetAllbiddersByTenderIdQuery();
  const [openTender, { isLoading: isOpening }] = useOpenTenderMutation();

  const handleOpenTender = async () => {
    try {
      await openTender({ tenderId: tenderId }).unwrap();
      notify('Success', 'All tenders opened successfully');
      router.push('/opening');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <>
      <TenderOverView />
      <Section
        title="Bidders List"
        collapsible={false}
        className="mt-2"
        action={
          <Button onClick={handleOpenTender} loading={isOpening}>
            Open All
          </Button>
        }
      >
        <ExpandableTable
          config={config}
          data={bidders?.items ?? []}
          total={bidders?.total ?? 0}
          onRequestChange={(request) => {
            getBidders({ tenderId, collectionQuery: request });
          }}
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
      value: tender.status,
    },
  ];

  return (
    <Box className="bg-white p-2">
      <DetailTable data={data} />
    </Box>
  );
};
