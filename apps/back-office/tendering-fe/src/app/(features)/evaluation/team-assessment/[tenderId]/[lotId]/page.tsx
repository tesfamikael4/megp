'use client';

import { ActionIcon, Box, Badge, Group, Button, Text } from '@mantine/core';
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
import { TenderOverView } from '../../../_components/tender-overview';

export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const [submit, { isLoading }] = useSubmitEvaluationMutation();
  const { data: lotStatus } = useGetLotStatusQuery(lotId as string);
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    expandedRowContent: (record) => <DetailTender tender={record} />,
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

  const [getBidders, { data: bidders }] = useLazyGetPassedBiddersQuery();
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
      }).unwrap();
      notify('Success', 'Evaluation successfully submitted');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <>
      <TenderOverView basePath={`/evaluation/${tenderId}/${lotId}`} />
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

const DetailTender = ({ tender }: any) => {
  const data = [
    {
      key: 'Name',
      value: tender.name,
    },

    {
      key: 'Email',
      value: tender.email,
    },
    {
      key: 'Phone',
      value: tender.phone,
    },
    {
      key: 'Status',
      value: tender.status,
    },
  ];

  return (
    <Box className="bg-white p-2">
      <DetailTable data={data} />
    </Box>
  );
};
