'use client';
import { Button, Flex, Text } from '@mantine/core';
import Table from './_components/table';
import Image from 'next/image';
import PageWrapper from '@/app/(features)/vendor/_components/page-wrapper';

// Get the current date and time
const currentDate = new Date();
// Format the date
const formattedDate = currentDate.toLocaleString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

function AwardNotice() {
  return (
    <PageWrapper
      header={
        <Flex className="flex justify-between p-4 border-b-2 border-gray-300">
          <Flex direction={'column'} className="w-full py-2">
            <Flex justify="space-between" align="center">
              <Flex align={'center'} gap={'xs'} h={'100%'}>
                <Image src="/ppda-svg.svg" alt="logo" height="18" width="18" />
                <Text className="text-xl font-bold" c={'#222262'}>
                  PPDA
                </Text>
              </Flex>
            </Flex>
            <Text fw={700} fz="xl" pt={3} c={'#1D8E3F'}>
              Award Announcement
            </Text>
            <Text fz="sm" pt={3}>
              Reference Number : PIST11-NCB-G-0042-2016-PUR
            </Text>
            <Text fz="sm" pt={3}>
              Procuring Entity : Perago Information Systems Test
            </Text>
            <Text fz="sm" pt={3}>
              Bid Name : Toilet paper 100gm
            </Text>
            <Text fz={14} c="#37415199" mt={6}>
              Thank you for participating in the above-mentioned tender
              procedure
            </Text>
          </Flex>
          <Text fz="xs" w={200}>
            Date: {formattedDate}
          </Text>
        </Flex>
      }
    >
      <Flex className="flex-col gap-4">
        <Table />
        <Flex justify="flex-end" gap={16}>
          <Button
            // leftSection={<IconCircleCheckFilled />}
            variant="outline"
            size="xs"
            w={120}
          >
            Accept Award
          </Button>
          <Button
            // leftSection={<IconX />}
            variant="filled"
            bg={'#FC1919'}
            size="xs"
            w={120}
          >
            Reject Award
          </Button>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}

export default AwardNotice;
