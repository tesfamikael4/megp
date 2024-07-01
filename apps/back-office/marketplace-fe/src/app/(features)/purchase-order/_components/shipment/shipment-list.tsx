import { Modal, Button, Box, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section } from '@megp/core-fe';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import ShipmentModal from '../list-of-items/shipment-modal';
import { useLazyListByIdQuery } from '@/app/(features)/purchase-order/_api/shipment.api';
import { useParams } from 'next/navigation';
import { DateInput } from '@mantine/dates';
import { useRouter } from 'next/navigation';

export default function ShipmentList() {
  const [opened, { open, close }] = useDisclosure();

  const { id } = useParams();

  const [trigger, { data: shipmentList }] = useLazyListByIdQuery();

  const router = useRouter();

  const config = {
    columns: [
      {
        accessory: 'deliveryLocation.region',
        title: 'Region',
        width: 200,
        render: (shipment) => (
          <Box>{shipment?.deliveryLocation?.regionName}</Box>
        ),
      },
      {
        accessory: 'deliveryLocation.district',
        title: 'District',
        width: 200,
        render: (shipment) => (
          <Box>{shipment?.deliveryLocation?.districtName}</Box>
        ),
      },
      {
        accessory: 'expectedDeliveryDate',
        title: 'Expected Delivery Date',
        render: (shipment) => {
          const convertedDate = new Date(shipment?.expectedDeliveryDate);
          return <DateInput value={convertedDate} disabled />;
        },
      },
      {
        accessor: 'id',
        title: '',
        render: (order) => (
          <ActionIcon
            variant="outline"
            onClick={() =>
              router.push(`/purchase-order/${id}/shipment/${order?.id}`)
            }
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
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
