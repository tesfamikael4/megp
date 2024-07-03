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
import { useReadDistQuery } from '@/app/(features)/my-workspace/catalog-manager/_api/catalog.api';
import { ExpandableTable, logger, notify } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { useDisclosure } from '@mantine/hooks';
import { DeliverDaysForm } from './delivery-form';
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

export const DeliverDays = ({
  deliveryValues,
  setDeliveryValues,
}: {
  deliveryValues: any;
  setDeliveryValues: any;
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = (index: string) => {
    const filteredDeliveryValues = deliveryValues.filter((_, i) => i !== index);
    setDeliveryValues(filteredDeliveryValues);
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
            {render?.location && (
              <DeliverDistrict districtId={render?.location} />
            )}
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
            {row?.quantity && (
              <NumberFormatter
                value={row?.quantity}
                decimalScale={0}
                thousandSeparator
              />
            )}
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
        render: (row: any, index) => (
          <Group className="ml-auto">
            <Button
              className="ml-auto"
              variant="light"
              onClick={() => handleDelete(index)}
            >
              <IconTrash size={14} color="red" />
            </Button>
          </Group>
        ),
      },
    ],
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
          data={deliveryValues ?? []}
          config={config}
          total={deliveryValues?.length ?? 0}
        />
      </Box>

      <Modal
        onClose={close}
        opened={opened}
        size={'lg'}
        title={<Title order={4}>Add Delivery Location</Title>}
      >
        <DeliverDaysForm
          close={close}
          deliveryValues={deliveryValues}
          setDeliveryValues={setDeliveryValues}
        />
      </Modal>
    </>
  );
};
