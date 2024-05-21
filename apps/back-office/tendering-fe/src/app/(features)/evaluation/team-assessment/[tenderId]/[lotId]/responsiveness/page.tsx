'use client';

import { ActionIcon, Group, Button, Text } from '@mantine/core';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  notify,
} from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { modals } from '@mantine/modals';
import {
  useGetLotStatusQuery,
  useLazyGetItemsQuery,
  useSubmitEvaluationMutation,
} from '@/store/api/tendering/technical-responsiveness.api';
import { LotOverview } from '@/app/(features)/evaluation/_components/lot-overview';
export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const { data: lotStatus } = useGetLotStatusQuery(lotId as string);
  const [submit, { isLoading }] = useSubmitEvaluationMutation();
  const [getItems, { data: items, isLoading: isItemsLoading }] =
    useLazyGetItemsQuery();
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
                `/evaluation/team-assessment/${tenderId}/${lotId}/responsiveness/${record.id}`,
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
        // isTeamLead: false,
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
      <LotOverview
        basePath={`/evaluation/${tenderId}/${lotId}/responsiveness`}
      />
      <Section
        title="Items List"
        collapsible={false}
        className="mt-2"
        action={
          <Group gap="md">
            {lotStatus?.isTeamLead?.isTeam && (
              <Button
                variant="outline"
                onClick={() => {
                  router.push(
                    `/evaluation/${tenderId}/${lotId}/responsiveness`,
                  );
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
          data={items?.items ?? []}
          total={items?.total ?? 0}
          onRequestChange={(request) => {
            getItems({ lotId, collectionQuery: request });
          }}
        />
      </Section>
    </>
  );
}
