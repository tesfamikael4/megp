'use client';
import { useEffect, useState } from 'react';
import {
  Modal,
  Group,
  Button,
  TextInput,
  Flex,
  Textarea,
  Box,
} from '@mantine/core';
import {
  ExpandableTable,
  ExpandableTableConfig,
  TableConfig,
  notify,
} from '@megp/core-fe';
import {
  useItemBulkCreateMutation,
  useLazyListPoItemListQuery,
} from '@/store/api/po-preparation/po-preparation.api';
import { useParams } from 'next/navigation';

export default function AwardedItemList({ opened, close }: any) {
  const { id } = useParams();

  const [trigger, { data: items }] = useLazyListPoItemListQuery();
  const [create] = useItemBulkCreateMutation();
  const [selected, setSelected] = useState<any[]>([]);
  const config: ExpandableTableConfig = {
    selectedItems: selected,
    setSelectedItems: setSelected,
    isSelectable: true,
    columns: [
      {
        accessor: 'name',
        title: 'Name',
      },
    ],
  };

  const onCreate = async (data) => {
    try {
      await create(data).unwrap();
      notify('Success', 'Item Assigned to Shipment successfully');
    } catch {
      notify('Error', 'Error in assigning Item');
    }
  };

  const onRequestChange = (request) => {
    trigger(id?.toString());
  };

  return (
    <Modal opened={opened} onClose={close} title="Item List" centered size="lg">
      <ExpandableTable
        data={items?.items ?? []}
        config={config}
        onRequestChange={onRequestChange}
      />
      <Flex justify={'flex-end'} align={'center'} mt="md" gap={'md'}>
        <Button onClick={close} bg={'red'}>
          Close
        </Button>
        <Button onClick={onCreate}>Save</Button>
      </Flex>
    </Modal>
  );
}
