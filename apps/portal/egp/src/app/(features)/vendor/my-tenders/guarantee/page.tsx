'use client';
import { Box, Button, Flex, Modal, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Table from '../_components/table/table';
const data = [
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    lotName: 'Toilet paper',
    procuringEntity: 'PERAGO',
    date: 'Mar/20/2024',
    status: 'Accepted',
  },
];
// const data = [];
const TenderPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<Date | null>(null);
  const router = useRouter();
  const handleButtonClick = () => {
    router.push('/vendor/my-tenders/guarantee/new');
  };
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <Box className="p-6 w-full bg-[#e7f4f7]">
      <Box className=" w-full p-6 min-h-screen bg-white">
        <Flex direction={'column'} className="w-full py-2 mb-3 ">
          <Text fw={700} fz="xl" c={'#1D8E3F'}>
            Guarantee List
          </Text>
          <Flex justify="flex-end " gap="md">
            <Button onClick={handleButtonClick}>New Guarantee</Button>
            <Button onClick={open}>Date</Button>
          </Flex>
          <Modal
            opened={opened}
            onClose={close}
            title="Extend Guarantee"
            centered
          >
            <DatePickerInput
              label="Extend"
              withAsterisk
              placeholder="Pick a date here"
              value={value}
              onChange={setValue}
            />
          </Modal>
        </Flex>
        <Table data={data ?? []} />
      </Box>
    </Box>
  );
};

export default TenderPage;
