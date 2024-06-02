'use client';

import { ActionIcon } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { ItemsOverview } from '@/app/(features)/evaluation/_components/item-overview';
import { useLazyGetPassedBiddersQuery } from '@/store/api/tendering/bid-price-evaluation.api';
export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId, itemId } = useParams();

  const [getBidders, { data: bidders, isLoading: isBiddersLoading }] =
    useLazyGetPassedBiddersQuery();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isLoading: isBiddersLoading,
    columns: [
      {
        accessor: 'bidderName',
        sortable: true,
        // render: (record) => record.bidder.bidderName,
        render: (record) =>
          record.bidRegistrationDetail.bidRegistration.bidderName,
      },
      // {
      //   accessor: 'status',
      //   width: 150,
      //   render: (record) => {
      //     const color = record.status === 'completed' ? 'green' : 'yellow';
      //     return (
      //       <Badge color={color} size="sm">
      //         {record.status}
      //       </Badge>
      //     );
      //   },
      // },
      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/evaluation/${tenderId}/${lotId}/financial/items/${itemId}/${record.bidRegistrationDetail.bidRegistration.bidderId}`,
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
      <ItemsOverview
        basePath={`/evaluation/${tenderId}/${lotId}/financial/items`}
      />
      <Section title="Bidders List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          // data={bidders?.items ?? []}
          data={bidders ?? []}
          total={bidders?.total ?? 0}
          onRequestChange={(request) => {
            getBidders({ lotId, itemId, collectionQuery: request });
          }}
        />
      </Section>
    </>
  );
}
