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
  TextInput,
} from '@mantine/core';
import { useState, type FC } from 'react';
import { StatsListCard } from './stats-card';
import { useGetVendorInfoQuery } from '../../_api/query';
import styles from './application-list.module.scss';
import DetailViewCard from './detail-view-card';
import { useDisclosure } from '@mantine/hooks';
import { ApplicationInfo } from '@/models/vendorRegistration';
import { IconFile, IconTrack } from '@tabler/icons-react';
import { IconSearch } from '@tabler/icons-react';

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
  return (
    <Box className="p-4">
      <Box className=" w-full p-4 min-h-screen bg-white">
        <Flex direction={'column'} className="w-full py-4 mb-3 border-b">
          <Text fw={700} fz="xl" c={'#1D8E3F'}>
            Application List
          </Text>
          <Text c={'dimmed'} size={'14px'} mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
            faucibus, enim ac dictum rutrum, velit quam pharetra mi, aliquet
            interdum velit libero nec risus. Aliquam non libero dolor.
          </Text>
          <Flex justify="flex-end">
            <TextInput
              className="mb-2 w-80 h-8"
              leftSection={<IconSearch />}
              onChange={(event) => {
                console.log('Hello world');
                // setSearch(event.currentTarget.value);
              }}
              placeholder="Search files by lorem, lorem"
              rightSectionWidth={30}
            />
          </Flex>
        </Flex>
        {requestInfo.data?.services && requestInfo.data?.services.length > 0 ? (
          <Box className={styles.mainGrid}>
            <Box className={opened ? styles.cardListWrap : styles.cardList}>
              {requestInfo.data?.services.map((data, index) => (
                <StatsListCard
                  key={index}
                  data={data}
                  view={handleDetailOpen}
                />
              ))}
            </Box>
            {opened && selectData && (
              <Box className={styles.detail}>
                <DetailViewCard data={selectData} close={handleDetailClose} />
              </Box>
            )}
          </Box>
        ) : (
          <Flex className="w-full h-full items-center justify-center flex-col">
            <IconFile size={30} />
            No Data Found
          </Flex>
        )}
      </Box>
    </Box>
  );
};
export default ApplicationList;
