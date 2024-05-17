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
import { modals } from '@mantine/modals';
import { useEffect } from 'react';
import {
  useGetLotStatusQuery,
  useLazyGetPassedBiddersQuery,
  useLazyGetResponsivenessAssessmentsQuery,
  useSubmitEvaluationMutation,
} from '@/store/api/tendering/technical-responsiveness.api';
import { LotOverview } from '@/app/(features)/evaluation/_components/lot-overview';
export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const { data: lotStatus } = useGetLotStatusQuery(lotId as string);
  const [submit, { isLoading }] = useSubmitEvaluationMutation();
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
                `/evaluation/team-assessment/${tenderId}/${lotId}/responsiveness/${record.bidder.bidderId}`,
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
        isTeamLead: true,
        tenderId: tenderId as string,
      }).unwrap();
      notify('Success', 'Evaluation successfully completed');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <>
      <LotOverview basePath={`/evaluation/${tenderId}`} />
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
                  router.push(`/evaluation/${tenderId}/${lotId}/qualification`);
                }}
                disabled={!lotStatus?.canTeamAssess}
              >
                Personal Assessment
              </Button>
            )}
            <Button
              onClick={onSubmit}
              loading={isLoading}
              disabled={lotStatus?.isTeamLead?.hasCompleted ?? true}
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
    useLazyGetResponsivenessAssessmentsQuery();

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
