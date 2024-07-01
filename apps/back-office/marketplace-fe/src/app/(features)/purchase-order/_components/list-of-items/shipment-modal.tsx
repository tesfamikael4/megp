import { Modal, Group, Button, TextInput, Flex, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import ShippingForm from './shipment-form';

export default function ShipmentModal({ opened, close }: any) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Item Shipment"
      centered
      size="xl"
    >
      <ShippingForm close={close} />
    </Modal>
  );
}
