import { useState } from 'react';
import {
  Modal,
  Group,
  Button,
  TextInput,
  Flex,
  Textarea,
  Box,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';

export default function Receiver({ opened, close }: any) {
  return (
    <Modal opened={opened} onClose={close} title="Receiver" centered size="lg">
      <Box mih={'30vh'}>
        <Flex direction="column" gap="lg">
          <TextInput label="Name" placeholder="Enter Name" value="" />
          <TextInput label="Role" placeholder="Enter Role" />
        </Flex>
      </Box>
      <Flex justify={'flex-end'} align={'center'} mt="md" gap={'md'}>
        <Button onClick={close} bg={'red'}>
          Close
        </Button>
        <Button>Save</Button>
      </Flex>
    </Modal>
  );
}
