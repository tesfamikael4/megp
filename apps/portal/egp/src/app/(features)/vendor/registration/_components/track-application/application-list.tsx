'use client';
import { Box, Flex, Grid, Group, Paper, SimpleGrid, Text } from '@mantine/core';
import { useState, type FC } from 'react';
import { StatsListCard } from './stats-card';
import { useGetVendorInfoQuery } from '../../_api/query';
import styles from './application-list.module.scss';
import DetailViewCard from './detail-view-card';
import { useDisclosure } from '@mantine/hooks';
export interface Application {
  name: string;
  serviceStatus: string;
  serviceRemark: string;
  category: string;
  serviceActionType: string;
  trackingNumber: string;
  date: string;
}
const sampleData: Application[] = [
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
];

const ApplicationList = () => {
  const [selectData, setSelectData] = useState<Application | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleDetailOpen = (data: Application) => {
    open();
    setSelectData(data);
  };
  const handleDetailClose = () => {
    close();
    setSelectData(null);
  };

  return (
    <Box className={styles.root}>
      <Flex className={styles.header}>
        <Flex className={styles.headerTitle}>
          <Text fw={600} fz="lg">
            Application List
          </Text>
        </Flex>
      </Flex>
      <Box className={styles.mainGrid}>
        <Box className={opened ? styles.cardListWrap : styles.cardList}>
          {sampleData.map((data, index) => (
            <StatsListCard key={index} data={data} view={handleDetailOpen} />
          ))}
        </Box>
        {opened && selectData && (
          <Box className={styles.detail}>
            <DetailViewCard data={selectData} close={handleDetailClose} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default ApplicationList;
