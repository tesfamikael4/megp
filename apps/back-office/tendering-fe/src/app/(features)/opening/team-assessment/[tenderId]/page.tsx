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
    isExpandable: true,
    expandedRowContent: (record) => <DetailTender tender={record} />,
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
              router.push(`/opening/team-assessment/${tenderId}/${record.id}`);
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
        <Text size="sm">
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Text>
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
        isTeamLead: true,
      }).unwrap();
      notify('Success', 'All tenders opened successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <>
      <TenderOverView />
      <Section
        title="Lots List"
        collapsible={false}
        className="mt-2"
        action={
          <Group gap="md">
            <Button variant="outline">Personal Assessment</Button>
            <Button
              onClick={onSubmit}
              loading={isLoading}
              disabled={tenderStatus?.isTeamLead?.hasCompleted}
            >
              Submit
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

const DetailTender = ({ tender }: any) => {
  const config: ExpandableTableConfig = {
    columns: [
      {
        accessor: 'name',
      },
      {
        accessor: 'email',
      },
      {
        accessor: 'phone',
      },
    ],
  };

  return (
    <Box className="bg-white p-5">
      <Text fw={500}>Bidders List</Text>
      <ExpandableTable config={config} data={[]} />
    </Box>
  );
};
