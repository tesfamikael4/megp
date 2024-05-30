'use client';
import { Text, Button, Group, Box } from '@mantine/core';
import { ExpandableTableConfig, Section, notify } from '@megp/core-fe';
import { IconX } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import {
  useDeleteMutation,
  useLazyListByIdQuery,
} from '../../_api/tender/lot.api';
import { modals } from '@mantine/modals';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import ItemList from '../../_components/items';

export default function Lot() {
  const { id } = useParams();

  const [trigger, { data: lots, isFetching }] = useLazyListByIdQuery();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const openDeleteModal = (lotId: string) => {
    modals.openConfirmModal({
      title: `Re-advertize Lot`,
      centered: true,
      children: (
        <Text size="sm">{`Are you sure you want to re-advertize this lot `}</Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await remove(lotId?.toString())
          .unwrap()
          .then(() => {
            notify('Success', 'lot re-advertised successfully');
          })
          .catch(() => {
            notify('Error', 'Error in deleting lot');
          });
      },
    });
  };
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isLoading: isFetching,
    isExpandable: true,
    expandedRowContent: (record) => (
      <Box className="p-3">
        <ItemList lotId={record.id} />
      </Box>
    ),
    columns: [
      {
        accessor: 'name',
        width: 200,
        sortable: true,
      },
      {
        accessor: 'status',
        width: 100,
        sortable: true,
      },
      {
        accessor: 'action',
        width: 100,
        render: (record) => (
          <Group>
            <Button
              color="red"
              leftSection={<IconX size={14} stroke={1.6} />}
              loading={isDeleting}
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(record.id);
              }}
            >
              Cancel
            </Button>
          </Group>
        ),
      },
    ],
  };

  return (
    <Section title="Lots" collapsible={false}>
      {id && (
        <ExpandableTable
          config={config}
          data={lots?.items ?? []}
          total={lots?.total ?? 0}
          onRequestChange={(collectionQuery) => {
            trigger({
              id: id.toString(),
              collectionQuery: collectionQuery,
            });
          }}
        />
      )}
    </Section>
  );
}
