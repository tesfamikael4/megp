'use client';

import {
  ActionIcon,
  Box,
  Badge,
  Group,
  Button,
  Text,
  LoadingOverlay,
} from '@mantine/core';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  notify,
} from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { DetailTable } from '../../../_components/detail-table';
import {
  useGetLotStatusQuery,
  useLazyGetPassedBiddersQuery,
  useSubmitEvaluationMutation,
} from '@/store/api/tendering/preliminary-compliance.api';
import { modals } from '@mantine/modals';
import { LotOverview } from '../../../_components/lot-overview';
import { useLazyGetOpeningAssessmentsQuery } from '@/store/api/tendering/tender-opening.api';
import { useEffect } from 'react';

export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const [submit, { isLoading }] = useSubmitEvaluationMutation();
  const { data: lotStatus } = useGetLotStatusQuery(lotId as string);
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
                `/evaluation/team-assessment/${tenderId}/${lotId}/${record.bidder.bidderId}`,
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

  const onSubmit = () => {
    modals.openConfirmModal({
      centered: true,
      title: 'Please confirm your action',
      children: (
        <Text size="sm">Are you sure you want to complete the evaluation?</Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: confirm,
      confirmProps: { color: 'green' },
    });
  };

  const confirm = async () => {
    try {
      await submit({
        lotId: lotId as string,
        tenderId: tenderId as string,
        isTeamLead: true,
      }).unwrap();
      notify('Success', 'Evaluation successfully submitted');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <>
      <LotOverview basePath={`/evaluation/${tenderId}/${lotId}`} />
      <Section
        title="Bidders List"
        collapsible={false}
        className="mt-2"
        action={
          <Group gap="md">
            {lotStatus?.isTeamLead?.isTeam && (
              <Button
                variant="outline"
                onClick={() => {
                  router.push(`/opening/team-assessment/${tenderId}`);
                }}
              >
                Personal Assessment
              </Button>
            )}
            <Button
              onClick={onSubmit}
              loading={isLoading}
              disabled={lotStatus?.isTeamLead?.hasCompleted}
            >
              Complete
            </Button>
          </Group>
        }
      >
        <ExpandableTable
          config={config}
          data={bidders?.items ?? []}
          total={bidders?.total ?? 0}
          onRequestChange={(request) => {
            getBidders({ lotId, collectionQuery: request, team: 'teamLeader' });
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
