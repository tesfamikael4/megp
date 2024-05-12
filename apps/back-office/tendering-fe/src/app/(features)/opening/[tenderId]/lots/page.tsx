'use client';

import { ActionIcon, Box, Button, Group, Text } from '@mantine/core';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  notify,
} from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { TenderOverView } from '../../_components/tender-overview';
import {
  useCompleteOpeningMutation,
  useGetTenderOpeningStatusQuery,
  useLazyGetLotsByTenderIdQuery,
} from '@/store/api/tendering/tendering.api';
import { modals } from '@mantine/modals';

export default function BidOpening() {
  const router = useRouter();
  const { tenderId } = useParams();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    columns: [
      {
        accessor: 'name',
        width: 400,
        sortable: true,
      },
      {
        accessor: 'status',
        width: 50,
        sortable: true,
      },

      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/opening/${tenderId}/lots/${record.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 10,
      },
    ],
  };
  const [getLots, { data: lots }] = useLazyGetLotsByTenderIdQuery();
  const [submit, { isLoading }] = useCompleteOpeningMutation();
  const { data: tenderStatus } = useGetTenderOpeningStatusQuery(
    tenderId as string,
  );

  //helpers
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
        tenderId: tenderId as string,
        isTeamLead: false,
      }).unwrap();
      notify('Success', 'All tenders opened successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <>
      <TenderOverView basePath="/opening/" />
      <Section
        title="Lots List"
        collapsible={false}
        className="mt-2"
        action={
          <Group gap="md">
            {tenderStatus?.isTeamLead?.isTeam && (
              <Button
                variant="outline"
                onClick={() => {
                  router.push(`/opening/team-assessment/${tenderId}`);
                }}
                disabled={!tenderStatus?.canTeamAssess}
              >
                Team Assessment
              </Button>
            )}
            <Button
              onClick={onSubmit}
              loading={isLoading}
              disabled={tenderStatus?.hasCompleted}
            >
              Complete
            </Button>
          </Group>
        }
      >
        <ExpandableTable
          config={config}
          data={lots?.items ?? []}
          total={lots?.total ?? 0}
          onRequestChange={(request) => {
            getLots({
              tenderId,
              collectionQuery: request,
            });
          }}
        />
      </Section>
    </>
  );
}
