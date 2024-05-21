'use client';

import { ActionIcon, Box, Badge, LoadingOverlay } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  useLazyGetPassedBiddersQuery,
  useLazyGetResponsivenessAssessmentsQuery,
} from '@/store/api/tendering/technical-responsiveness.api';
import { ItemsOverview } from '@/app/(features)/evaluation/_components/item-overview';
export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId, itemId } = useParams();

  const [getBidders, { data: bidders, isLoading: isBiddersLoading }] =
    useLazyGetPassedBiddersQuery();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    isLoading: isBiddersLoading,
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
                `/evaluation/${tenderId}/${lotId}/responsiveness/${itemId}/${record.bidder.bidderId}`,
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
        basePath={`/evaluation/${tenderId}/${lotId}/responsiveness`}
      />
      <Section title="Bidders List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={bidders?.items ?? []}
          total={bidders?.total ?? 0}
          onRequestChange={(request) => {
            getBidders({ lotId, itemId, collectionQuery: request });
          }}
        />
      </Section>
    </>
  );
}

const BidderDetail = ({ bidder }: any) => {
  const { lotId } = useParams();

  const [getChecklists, { data, isLoading }] =
    useLazyGetResponsivenessAssessmentsQuery();

  useEffect(() => {
    getChecklists({
      lotId: lotId as string,
      bidderId: bidder.bidder.bidderId,
    });
  }, []);

  return (
    <Box className="bg-white p-5" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <ExpandableTable
        config={{
          minHeight: 100,
          columns: [
            {
              accessor: 'itbDescription',
              title: 'Name',
            },
            {
              accessor: 'Assessment',
              width: 200,
              render: (record) =>
                record.check?.qualified
                  ? record?.check?.qualified
                  : 'Not Evaluated Yet',
            },
          ],
        }}
        data={data ?? []}
      />
    </Box>
  );
};
