'use client';

import { ActionIcon } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { LotOverview } from '../../../_components/lot-overview';
import { useLazyGetPassedBiddersQuery } from '@/store/api/tendering/price-analysis.api';
export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const [getBidders, { data: bidders, isLoading: isBiddersLoading }] =
    useLazyGetPassedBiddersQuery();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isLoading: isBiddersLoading,
    columns: [
      {
        accessor: 'bidderName',
        title: 'Bidder',
        sortable: true,
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
                `/evaluation/${tenderId}/${lotId}/price-analysis/${record.bidRegistrationDetail.bidRegistration.bidderId}`,
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
      <LotOverview
        basePath={`/evaluation/${tenderId}`}
        milestone="priceAnalysis"
      />
      <Section title="Bidders List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={bidders ?? []}
          total={bidders?.length ?? 0}
          onRequestChange={(request) => {
            getBidders({ lotId, collectionQuery: request });
          }}
        />
      </Section>
    </>
  );
}
