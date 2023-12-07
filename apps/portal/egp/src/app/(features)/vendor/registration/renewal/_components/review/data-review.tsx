'use client';

import { Box, Button, Card, Flex, Stack, Text } from '@mantine/core';
import styles from './data-review.module.scss';
import { useRouter } from 'next/navigation';
import { useGetVendorQuery } from '../../../_api/query';
import { useEffect } from 'react';

const DataReview = () => {
  const router = useRouter();
  const requestInfo = useGetVendorQuery({});
  useEffect(() => {
    if (requestInfo.isError) {
      // NotificationService.requestErrorNotification('Error on fetching data');
    }

    return () => {};
  }, [requestInfo, router]);

  return (
    <Flex className={styles.main}>
      <Box className={styles.card}>
        <Box className={styles.cardHeader}>
          <Text fz={13} fw={500}>
            Vendor Profile
          </Text>
        </Box>
        <Stack className={styles.cardBody}>
          <Flex className=" items-center gap-2">
            <Text fz={12} fw={500}>
              Company Name :
            </Text>
            <Text fz="xs">Test Name</Text>
          </Flex>
          <Flex className=" items-center gap-2">
            <Text fz={12} fw={500}>
              Tin Number :
            </Text>
            <Text fz="xs">1291655</Text>
          </Flex>
          <Flex className=" items-center gap-2">
            <Text fz={12} fw={500}>
              M-EGP Registration No:
            </Text>
            <Text fz="xs">Test Name</Text>
          </Flex>
        </Stack>
        <Box className={styles.cardHeader}>
          <Text fz={13} fw={500}>
            Area of Registration
          </Text>
        </Box>
        <Stack className={styles.cardBody}>
          <Flex className=" items-center flex-col">
            <Flex className="justify-between w-full">
              <Text fz={14} fw={600} className="text-gray-400">
                For
              </Text>
              <Text fz={14} fw={600} className="text-gray-400">
                Price Range
              </Text>
            </Flex>

            <Flex className="items-center justify-between w-full">
              <Text fz={12} fw={600}>
                Goods
              </Text>
              <Text fz={12} fw={600}>
                Price Range
              </Text>
            </Flex>
          </Flex>
          <Flex className=" items-center flex-col">
            <Flex className="justify-between w-full">
              <Text fz={14} fw={600} className="text-gray-400">
                For
              </Text>
              <Text fz={14} fw={600} className="text-gray-400">
                Price Range
              </Text>
            </Flex>

            <Flex className="items-center justify-between w-full">
              <Text fz={12} fw={600}>
                Service
              </Text>
              <Text fz={12} fw={600}>
                Price Range
              </Text>
            </Flex>
          </Flex>
          <Flex className=" items-center flex-col">
            <Flex className="justify-between w-full">
              <Text fz={14} fw={600} className="text-gray-400">
                For
              </Text>
              <Text fz={14} fw={600} className="text-gray-400">
                Price Range
              </Text>
            </Flex>

            <Flex className="items-center justify-between w-full">
              <Text fz={12} fw={600}>
                Works
              </Text>
              <Text fz={12} fw={600}>
                Price Range
              </Text>
            </Flex>
          </Flex>
        </Stack>
        <Flex justify={'end'}>
          <Button>renewal</Button>
        </Flex>
      </Box>
      <Box className={styles.card}></Box>
    </Flex>
  );
};

export default DataReview;
