'use client';

import { Box, Card, Container, Flex, Stack, Text } from '@mantine/core';
import styles from './data-review.module.scss';
import { useRouter } from 'next/navigation';
import { useGetFormQuery } from '../../../_api/query';
import { useEffect } from 'react';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';

const DataReview = () => {
  const router = useRouter();
  const requestInfo = useGetFormQuery({});
  useEffect(() => {
    if (requestInfo.isError) {
      // NotificationService.requestErrorNotification('Error on fetching data');
    }

    return () => {};
  }, [requestInfo, router]);

  return (
    <Stack className={styles.main}>
      <Card py={30} shadow="sm" radius="md">
        <Card.Section inheritPadding withBorder mb={15}>
          <Text fz={14} fw={600} className={styles.cardTittle}>
            Vendor Profile
          </Text>
        </Card.Section>
        <Stack>
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
      </Card>
      <Card py={30} shadow="sm" radius="md">
        <Card.Section inheritPadding withBorder mb={15}>
          <Text fz={14} fw={600} className={styles.cardTittle}>
            Area of Registration
          </Text>
        </Card.Section>
        <Stack>
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
      </Card>
    </Stack>
  );
};

export default DataReview;
