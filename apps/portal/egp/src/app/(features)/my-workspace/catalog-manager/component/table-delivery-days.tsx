'use client';
import {
  Box,
  Button,
  Group,
  Modal,
  NumberFormatter,
  Title,
} from '@mantine/core';
import { IconCirclePlus, IconTrash } from '@tabler/icons-react';

import {
  useLazyGetDeliveryLocationQuery,
  useDeleteDeliveryLocationMutation,
  useReadDistQuery,
} from '../_api/catalog.api';
import { ExpandableTable, logger, notify } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { useDisclosure } from '@mantine/hooks';
import { DeliverDaysForm } from './delivary-form';
import { useParams } from 'next/navigation';

interface DeliverDays {
  quantity: number;
  deliverDays: number;
  district: string;
}

const DeliverDistrict = ({ districtId }) => {
  const { data: district } = useReadDistQuery(districtId.toString());
  return <Box>{district?.name}</Box>;
};

export const DeliverDays = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [trigger, { data: deliveryLocations }] =
    useLazyGetDeliveryLocationQuery();

  const { id } = useParams();

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
        render: (render) => (
          <Box>
            <DeliverDistrict districtId={render?.location} />
          </Box>
        ),
      },
      {
        accessor: 'deliverDays',
        title: 'Delivery Days',
      },
      {
        accessor: 'quantity',
        title: 'Quantity',
        render: (row: any) => (
          <Box>
            <NumberFormatter
              value={row?.quantity}
              decimalScale={0}
              thousandSeparator
            />
          </Box>
        ),
      },
      {
        accessor: 'actions',
        title: (
          <Group>
            {' '}
            <Group className="ml-auto">Actions</Group>
          </Group>
        ),
        render: (row: any) => (
          <Group className="ml-auto">
            <Button
              className="ml-auto"
              variant="light"
              onClick={() => handleDelete(row.id)}
            >
              <IconTrash size={14} color="red" />
            </Button>
          </Group>
        ),
      },
    ],
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ id: id?.toString(), collectionQuery: request });
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
