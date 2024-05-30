'use client';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section, notify } from '@megp/core-fe';
import { LoadingOverlay, Text, Group, Button } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { CollectionQuery } from '@megp/entity';
import { useEffect } from 'react';
import { useDeleteMutation, useLazyListByIdQuery } from '../_api/lot/items.api';
import { modals } from '@mantine/modals';

export default function ItemList({
  lotId,
}: Readonly<{ lotId: string | null }>) {
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const openDeleteModal = (lotId: string) => {
    modals.openConfirmModal({
      title: `Re-advertize Lot`,
      centered: true,
      children: (
        <Text size="sm">{`Are you sure you want to re-advertize this item `}</Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await remove(lotId?.toString())
          .unwrap()
          .then(() => {
            notify('Success', 'item re-advertised successfully');
          })
          .catch(() => {
            notify('Error', 'Error in deleting item');
          });
      },
    });
  };
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 300 },
      { accessor: 'description', title: 'Description', width: 150 },
      {
        accessor: 'procurementCategory',
        title: 'Procurement Category',
        width: 150,
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
              onClick={() => {
                openDeleteModal(record.id);
              }}
            >
              Cancel
            </Button>
          </Group>
        ),
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'name',
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ id: lotId ?? '', collectionQuery: request });
  };

  useEffect(() => {
    if (lotId) {
      trigger({ id: lotId ?? '', collectionQuery: { skip: 0, take: 10 } });
    }
  }, [lotId, trigger]);

  return (
    <Section title="Items" collapsible={false} defaultCollapsed={false}>
      <LoadingOverlay
        visible={isFetching}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}
