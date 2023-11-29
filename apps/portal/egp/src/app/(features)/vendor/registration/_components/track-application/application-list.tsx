'use client';
import {
  Box,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { useState, type FC } from 'react';
import { StatsListCard } from './stats-card';
import { useGetVendorInfoQuery } from '../../_api/query';
import styles from './application-list.module.scss';
import DetailViewCard from './detail-view-card';
import { useDisclosure } from '@mantine/hooks';
import { ApplicationInfo } from '@/models/vendorRegistration';

const ApplicationList = () => {
  const [selectData, setSelectData] = useState<ApplicationInfo | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const requestInfo = useGetVendorInfoQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const handleDetailOpen = (data: ApplicationInfo) => {
    open();
    setSelectData(data);
  };
  const handleDetailClose = () => {
    close();
    setSelectData(null);
  };

  if (requestInfo.isLoading) {
    return (
      <Box pos="relative" className="w-full h-full">
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      </Box>
    );
  }
  if (!requestInfo.data || requestInfo.isError) {
    return null;
  }
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
          {requestInfo.data?.services.map((data, index) => (
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
