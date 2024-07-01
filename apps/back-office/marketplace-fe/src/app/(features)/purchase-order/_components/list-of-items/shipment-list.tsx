import { Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section } from '@megp/core-fe';
import { IconPlus } from '@tabler/icons-react';
import ShipmentModal from '../list-of-items/shipment-modal';
import { useState } from 'react';
import { useLazyListByIdQuery } from '@/app/(features)/purchase-order/_api/shipment.api';
import { useParams } from 'next/navigation';

export default function ShipmentList() {
  const [opened, { open, close }] = useDisclosure();

  const { id } = useParams();

  const [trigger, { data: shipmentList }] = useLazyListByIdQuery();

  const config = {
    columns: [
      {
        accessory: 'name',
        title: 'Name',
      },
    ],
  };

  const onRequestChange = (request) => {
    trigger({ id: id?.toString(), collectionQuery: request });
  };

  return (
    <>
      <Section
        collapsible={false}
        title={'Shipment'}
        action={
          <Button>
            <IconPlus onClick={open} />
            New
          </Button>
        }
      >
        <ExpandableTable
          config={config}
          data={shipmentList?.items ?? []}
          onRequestChange={onRequestChange}
          total={shipmentList?.total}
        />
      </Section>
      <ShipmentModal opened={opened} close={close} />
    </>
  );
}
