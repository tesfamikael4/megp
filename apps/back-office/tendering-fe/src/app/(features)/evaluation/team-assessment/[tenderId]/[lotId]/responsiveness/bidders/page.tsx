'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight, IconNotes, IconUsers } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyGetPassedBiddersByLotIdQuery } from '@/store/api/tendering/technical-responsiveness.api';
import { LotOverview } from '@/app/(features)/evaluation/_components/lot-overview';
export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const [getBidders, { data: bidders, isLoading: isBiddersLoading }] =
    useLazyGetPassedBiddersByLotIdQuery();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isLoading: isBiddersLoading,
    columns: [
      {
        accessor: 'bidderName',
        title: 'Name',
        sortable: true,
      },
      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/evaluation/team-assessment/${tenderId}/${lotId}/responsiveness/bidders/${record.bidderId}`,
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
        milestone="technicalResponsiveness"
        teamAssessment
      />
      <Section
        title="Bidders List"
        collapsible={false}
        className="mt-2"
        action={
          <Tooltip label="Items List">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => {
                router.push(
                  `/evaluation/team-assessment/${tenderId}/${lotId}/responsiveness`,
                );
              }}
            >
              <IconNotes size={14} />
            </ActionIcon>
          </Tooltip>
        }
      >
        <ExpandableTable
          config={config}
          data={bidders ?? []}
          //   total={bidders?.total ?? 0}
          onRequestChange={(request) => {
            getBidders({ lotId, collectionQuery: request });
          }}
        />
      </Section>
    </>
  );
}
