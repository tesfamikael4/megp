import { useState } from 'react';
import { Modal, Group, Button, TextInput, Flex, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';

export default function BudgetSource({ opened, close }: any) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Budget Source"
      centered
      size="lg"
    >
      <Flex direction="column" gap="lg">
        <TextInput label="Chart of Account" value="" />
        <TextInput label="Quantity" placeholder="Enter Quantity" />
        <Group grow>
          <TextInput label="Enter Amount" type="number" />
        </Group>
      </Flex>
      <Flex justify={'flex-end'} align={'center'} mt="md" gap={'md'}>
        <Button onClick={close} bg={'red'}>
          Close
        </Button>
        <Button>Save</Button>
      </Flex>
    </Modal>
  );
}
