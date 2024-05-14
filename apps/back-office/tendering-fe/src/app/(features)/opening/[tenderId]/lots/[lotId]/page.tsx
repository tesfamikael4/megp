'use client';

import { ActionIcon, Box, Badge, LoadingOverlay } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  useLazyGetAllbiddersByLotIdQuery,
  useLazyGetOpeningAssessmentsQuery,
} from '@/store/api/tendering/tender-opening.api';
import { LotOverview } from '../../../_components/lot-overview';

export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const [getBidders, { data: bidders, isLoading }] =
    useLazyGetAllbiddersByLotIdQuery();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    isLoading: isLoading,
    expandedRowContent: (record) => <BidderDetail bidder={record} />,
    columns: [
      {
        accessor: 'bidderName',
        sortable: true,
        render: (record) => record.bidder.bidderName,
      },
      {
        accessor: 'status',
        width: 150,
        render: (record) => {
          const color = record.status === 'completed' ? 'green' : 'yellow';
          return (
            <Badge color={color} size="sm">
              {record.status}
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
                `/opening/${tenderId}/lots/${lotId}/${record.bidder.bidderId}`,
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
      <LotOverview basePath={`/opening/${tenderId}/lots`} />
      <Section title="Bidders List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={bidders?.items ?? []}
          total={bidders?.total ?? 0}
          onRequestChange={(request) => {
            getBidders({ lotId, collectionQuery: request });
          }}
        />
      </Section>
    </>
  );
}

const BidderDetail = ({ bidder }: any) => {
  const { lotId } = useParams();

  const [getChecklists, { data, isLoading }] =
    useLazyGetOpeningAssessmentsQuery();

  useEffect(() => {
    getChecklists({ lotId: lotId as string, bidderId: bidder.bidder.bidderId });
  }, []);

  return (
    <Box className="bg-white p-5" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <ExpandableTable
        config={{
          minHeight: 100,
          columns: [
            {
              accessor: 'name',
            },
            {
              accessor: 'Assessment',
              render: (record) =>
                record.check
                  ? record?.check?.checked
                    ? 'Yes'
                    : 'No'
                  : 'Not Evaluated Yet',
            },
          ],
        }}
        data={data ?? []}
      />
    </Box>
  );
};
