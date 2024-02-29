'use client';
import { Box, Button, Flex, Text } from '@mantine/core';
import styles from '../_components/sidebar/sidebar.module.scss';
import 'mantine-datatable/styles.layer.css';
import '@mantine/core/styles.layer.css';
import { useMediaQuery } from '@mantine/hooks';
import Table from '../_components/table';
import Image from 'next/image';
import Sidebar from '../_components/sidebar/sidebar';

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
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <Flex>
      <nav
        className={styles.nav}
        style={{
          backgroundColor: '#fff',
          display: isMobile ? 'none' : 'block',
        }}
      >
        <Sidebar />
      </nav>
      <Flex className="w-full p-6 bg-[#e7f4f7]">
        <Box className=" w-full p-6  bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-4 border-b-2">
            <Flex justify="space-between" align="center">
              <Flex align={'center'} gap={'xs'} h={'100%'}>
                <Image src="/ppda-svg.svg" alt="logo" height="18" width="18" />
                <Text className="text-xl font-bold" c={'#222262'}>
                  PPDA
                </Text>
              </Flex>
              <Text fz="xs">Date: {formattedDate}</Text>
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
            <Text fz="sm" pt={3} c={'dimmed'}>
              Thank you for participating in the above-mentioned tender
              procedure
            </Text>
          </Flex>

          <Table />
          <Flex justify="flex-end" gap={16} className="pt-6">
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
        </Box>
      </Flex>
    </Flex>
  );
}

export default AwardNotice;
