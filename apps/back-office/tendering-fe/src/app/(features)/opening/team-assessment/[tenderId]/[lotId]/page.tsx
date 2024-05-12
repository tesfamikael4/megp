'use client';

import { ActionIcon, Box, Badge, LoadingOverlay } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { TenderOverView } from '../../../_components/tender-overview';
import { useEffect } from 'react';
import {
  useLazyGetAllbiddersByLotIdQuery,
  useLazyGetOpeningAssessmentsQuery,
} from '@/store/api/tendering/tender-opening.api';

export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
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
                `/opening/team-assessment/${tenderId}/${lotId}/${record.bidder.bidderId}`,
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

  const [getBidders, { data: bidders }] = useLazyGetAllbiddersByLotIdQuery();
  return (
    <>
      <TenderOverView basePath={`/opening/team-assessment/${tenderId}`} />
      <Section title="Bidders List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={bidders?.items ?? []}
          total={bidders?.total ?? 0}
          onRequestChange={(request) => {
            getBidders({
              lotId,
              collectionQuery: request,
              team: 'teamLeader',
            });
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
    getChecklists({
      lotId: lotId as string,
      bidderId: bidder.bidder.bidderId,
      team: 'teamLeader',
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
