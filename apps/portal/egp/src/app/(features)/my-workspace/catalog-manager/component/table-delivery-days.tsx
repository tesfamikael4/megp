'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Title,
} from '@mantine/core';
import { IconCirclePlus, IconTrash } from '@tabler/icons-react';

import {
  useLazyGetDeliveryLocationQuery,
  useDeleteDeliveryLocationMutation,
} from '../_api/catalog.api';
import { ExpandableTable, logger, notify } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { useDisclosure } from '@mantine/hooks';
import { DeliverDaysForm } from './delivary-form';

interface DeliverDays {
  quantity: number;
  deliverDays: number;
  district: string;
}
export const DeliverDays = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [trigger, { data: deliveryLocations }] =
    useLazyGetDeliveryLocationQuery();

  const [onDelete] = useDeleteDeliveryLocationMutation();

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id).unwrap();
      notify('Success', 'Delivery location deleted successfully');
    } catch (error) {
      notify('Error', 'Failed to delete delivery location');
    }
  };

  const config = {
    columns: [
      {
        accessor: 'region',
        title: 'Region',
      },
      {
        accessor: 'district',
        title: 'District',
      },
      {
        accessor: 'deliveryDays',
        title: 'Delivery Days',
      },
      {
        accessor: 'quantity',
        title: 'Quantity',
      },
      {
        accessor: 'actions',
        render: (row: any) => (
          <Group className="ml-auto">
            <Button variant="light" onClick={() => handleDelete(row.id)}>
              <IconTrash size={14} color="red" />
            </Button>
          </Group>
        ),
      },
    ],
  };
  const onRequestChange = (request: CollectionQuery) => {
    logger.log(request);
    trigger(request);
  };

  return (
    <>
      <Box className="w-full ">
        <Group mb={'md'}>
          <Button className="ml-auto" onClick={open}>
            <IconCirclePlus size={24} className="me-1" />
            Add Delivery
          </Button>
        </Group>
        <ExpandableTable
          data={deliveryLocations?.items ?? []}
          config={config}
          total={deliveryLocations?.total}
          onRequestChange={onRequestChange}
        />
      </Box>

      <Modal
        onClose={close}
        opened={opened}
        size={'lg'}
        title={<Title order={4}>Add Delivery Location</Title>}
      >
        <DeliverDaysForm close={close} />
      </Modal>
    </>
  );
};
