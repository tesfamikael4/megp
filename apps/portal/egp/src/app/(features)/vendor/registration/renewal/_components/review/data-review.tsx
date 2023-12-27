'use client';
import { Box, Button, Card, Flex, Paper, Stack, Text } from '@mantine/core';
import styles from './data-review.module.scss';
import { useRouter } from 'next/navigation';
import {
  useGetForRenewalVendorQuery,
  useGetVendorQuery,
} from '../../../_api/query';
import { useEffect } from 'react';
import { IconAddressBook, IconUserCheck } from '@tabler/icons-react';

const DataReview = () => {
  const router = useRouter();
  const requestRenewalVendorInfo = useGetForRenewalVendorQuery({});
  const requestInfo = useGetVendorQuery({});

  // useEffect(() => {
  //   if (requestInfo.isError) {
  //     // NotificationService.requestErrorNotification('Error on fetching data');
  //   }

  //   return () => {};
  // }, [requestInfo, router]);
  if (requestInfo.data) {
  }

  return (
    <Box className={styles.main}>
      <Paper shadow="xs" className={styles.card}>
        <Box className={styles.cardHeader}>
          <IconUserCheck size={20} stroke={1.6} />
          <Text fz={16} fw={700} color="gray.5">
            Profile
          </Text>
        </Box>
        <Flex className={styles.cardBody}>
          <Stack>
            <Flex className=" items-center gap-2">
              <Text fz={12} fw={700}>
                Company Name :
              </Text>
              <Text fz="xs">{requestInfo.data?.basic.name}</Text>
            </Flex>
            <Flex className=" items-center gap-2">
              <Text fz={12} fw={700}>
                Tin Number :
              </Text>
              <Text fz="xs">{requestInfo.data?.basic.tinNumber}</Text>
            </Flex>
            <Flex className=" items-center gap-2">
              <Text fz={12} fw={700}>
                M-EGP Registration No:
              </Text>
              <Text fz="xs">{requestInfo.data?.id}</Text>
            </Flex>
            <Flex className=" items-center gap-2">
              <Text fz={12} fw={700}>
                Country of origin:
              </Text>
              <Text fz="xs">{requestInfo.data?.basic.origin}</Text>
            </Flex>
          </Stack>
        </Flex>
        <Box className={styles.cardHeader}>
          <IconAddressBook size={20} stroke={1.6} />
          <Text fz={16} fw={700} color="gray.5">
            Address
          </Text>
        </Box>
        <Flex className={styles.cardBody}>
          <Stack>
            <Flex className=" items-center gap-2">
              <Text fz={12} fw={700}>
                Mobile number :
              </Text>
              <Text fz="xs">{requestInfo.data?.address.mobilePhone}</Text>
            </Flex>
            <Flex className=" items-center gap-2">
              <Text fz={12} fw={700}>
                Email :
              </Text>
              <Text fz="xs">{requestInfo.data?.address.primaryEmail}</Text>
            </Flex>
            <Flex className=" items-center gap-2">
              <Text fz={12} fw={700}>
                Fax :
              </Text>
              <Text fz="xs">{requestInfo.data?.address.fax}</Text>
            </Flex>
            <Flex className=" items-center gap-2">
              <Text fz={12} fw={700}>
                Website:
              </Text>
              <Text fz="xs">{requestInfo.data?.address.website}</Text>
            </Flex>
          </Stack>
        </Flex>
        <Flex justify={'end'} p={10}>
          <Button onClick={() => router.push('ppda')}>renewal</Button>
        </Flex>
      </Paper>
    </Box>
  );
};

export default DataReview;
