'use client';

import { Button, Box, Badge } from '@mantine/core';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  notify,
} from '@megp/core-fe';
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
      router.push(`/opening/${tenderId}`);
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <>
      <TenderOverView basePath="/opening" />
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
