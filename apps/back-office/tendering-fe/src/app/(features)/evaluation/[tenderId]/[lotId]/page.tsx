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
import {
  useGetLotStatusQuery,
  useLazyGetComplianceAssessmentsQuery,
  useLazyGetPassedBiddersQuery,
  useSubmitEvaluationMutation,
} from '@/store/api/tendering/preliminary-compliance.api';
import { modals } from '@mantine/modals';
import { LotOverview } from '../../_components/lot-overview';
import { useEffect } from 'react';
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
        title: 'Bidder',
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
                `/evaluation/${tenderId}/${lotId}/${record.bidder.bidderId}`,
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
        isTeamLead: false,
        //  isTeamLead: true,
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
                  router.push(
                    `/evaluation/team-assessment/${tenderId}/${lotId}`,
                  );
                }}
                disabled={!lotStatus?.canTeamAssess}
              >
                Team Assessment
              </Button>
            )}
            <Button
              onClick={onSubmit}
              loading={isLoading}
              disabled={lotStatus?.hasCompleted ?? true}
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
    useLazyGetComplianceAssessmentsQuery();

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
              title: 'Requirements',
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
