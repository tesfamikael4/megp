'use client';
import { Flex, Group, Paper, SimpleGrid, Text } from '@mantine/core';
import { useState, type FC } from 'react';
import { StatsListCard } from './stats-card';
import { useGetVendorInfoQuery } from '../../_api/query';
import styles from './application-list.module.scss';
import ProgressBar from './progressBar';
import { IconSelect } from '@tabler/icons-react';
const sampleData = [
  {
    name: 'John Doe',
    serviceStatus: 'Adjust',
    serviceRemark: 'No issues',
    category: 'Goods',
    serviceActionType: 'Update',
    trackingNumber: 'TRK123',
    date: '2023-11-20',
  },
  {
    name: 'Jane Smith',
    serviceStatus: 'Rejected',
    serviceRemark: 'Pending verification',
    category: 'Service Category B',
    serviceActionType: 'Create',
    trackingNumber: 'TRK456',
    date: '2023-11-21',
  },
  {
    name: 'Bob Johnson',
    serviceStatus: 'Submitted',
    serviceRemark: 'Service in progress',
    category: 'Service Category C',
    serviceActionType: 'Delete',
    trackingNumber: 'TRK789',
    date: '2023-11-22',
  },
  {
    name: 'Alice Brown',
    serviceStatus: 'Adjust',
    serviceRemark: 'Verification failed',
    category: 'Services',
    serviceActionType: 'Create',
    trackingNumber: 'TRK101',
    date: '2023-11-23',
  },
  {
    name: 'Charlie Wilson',
    serviceStatus: 'Submitted',
    serviceRemark: 'No issues',
    category: 'Goods',
    serviceActionType: 'Update',
    trackingNumber: 'TRK111',
    date: '2023-11-24',
  },
  {
    name: 'Eva Williams',
    serviceStatus: 'Adjust',
    serviceRemark: 'Update required',
    category: 'Services',
    serviceActionType: 'Update',
    trackingNumber: 'TRK222',
    date: '2023-11-25',
  },
  {
    name: 'David Anderson',
    serviceStatus: 'Submitted',
    serviceRemark: 'Pending approval',
    category: 'Goods',
    serviceActionType: 'Create',
    trackingNumber: 'TRK333',
    date: '2023-11-26',
  },
  {
    name: 'Grace Miller',
    serviceStatus: 'Adjust',
    serviceRemark: 'In process',
    category: 'Service Category A',
    serviceActionType: 'Delete',
    trackingNumber: 'TRK444',
    date: '2023-11-27',
  },
  {
    name: 'Frank Taylor',
    serviceStatus: 'Submitted',
    serviceRemark: 'Completed',
    category: 'Services',
    serviceActionType: 'Update',
    trackingNumber: 'TRK555',
    date: '2023-11-28',
  },
  {
    name: 'Helen Brown',
    serviceStatus: 'Rejected',
    serviceRemark: 'Documentation missing',
    category: 'Goods',
    serviceActionType: 'Create',
    trackingNumber: 'TRK666',
    date: '2023-11-29',
  },
  // Add more objects with different data as needed
];
const Current = () => {
  return <Paper></Paper>;
};
const ApplicationList = () => {
  const [selectId, setSelectedId] = useState<string | null>('null');
  const requestInfo = useGetVendorInfoQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  return (
    <Flex className={styles.main}>
      <Flex className={styles.nav}>
        <Flex className="w-full p-3">
          <Text fw={700} fz="lg">
            Application List
          </Text>
        </Flex>
        <Flex className="">
          <SimpleGrid cols={2} p="xs">
            {sampleData.map((data, index) => (
              <StatsListCard key={index} {...data} />
            ))}
          </SimpleGrid>
          <Flex className="flex-col">
            <Flex className={styles.detailWrapper}>
              {selectId != null ? (
                <Group miw={'150px'}>
                  <ProgressBar />
                </Group>
              ) : (
                <Flex className="w-32">
                  <IconSelect />
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default ApplicationList;
