'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight, IconUsers } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import {
  useLazyGetItemsByBidderIdQuery,
  useLazyGetItemsQuery,
} from '@/store/api/tendering/technical-responsiveness.api';
import { BidderOverView } from '@/app/(features)/evaluation/_components/bidder-overview';
export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId, bidderId } = useParams();
  const [getItems, { data: items, isLoading: isItemsLoading }] =
    useLazyGetItemsByBidderIdQuery();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isLoading: isItemsLoading,
    columns: [
      {
        accessor: 'name',
        sortable: true,
      },
      {
        accessor: 'description',
      },
      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/evaluation/team-assessment/${tenderId}/${lotId}/responsiveness/bidders/${bidderId}/${record.id}`,
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
      <BidderOverView
        basePath={`/evaluation/${tenderId}/${lotId}/responsiveness/bidders`}
        milestone="technicalResponsiveness"
        hideComplete
      />
      <Section title="Items List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={items ?? []}
          // total={items?.total ?? 0}
          onRequestChange={(request) => {
            getItems({ lotId, bidderId, collectionQuery: request });
          }}
        />
      </Section>
    </>
  );
}
