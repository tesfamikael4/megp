'use client';
import {
  Badge,
  Box,
  Flex,
  LoadingOverlay,
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
import { ExpandableTable } from './table';
import 'mantine-datatable/styles.layer.css';

const badgeBGColor: { [key: string]: string } = {
  Rejected: `red.0`,
  Submitted: `blue.0`,
  Adjustment: `yellow.0`,
  Completed: `green.0`,
  Pending: `blue.0`,
  Outdated: `orange.0`,
};
const badgeTextColor: { [key: string]: string } = {
  Rejected: `red.6`,
  Submitted: `blue.6`,
  Adjustment: `yellow.6`,
  Completed: `green.6`,
  Pending: `blue.6`,
  Outdated: `orange.6`,
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const ApplicationList = () => {
  const [selectData, setSelectData] = useState<ApplicationInfo | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const requestInfo = useGetVendorInfoQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const handleDetailClose = () => {
    close();
    setSelectData(null);
  };

  const config = {
    columns: [
      {
        accessor: 'name',
        title: 'Service Name',
        render: (application) => application.BpService.name,
      },
      {
        accessor: 'category',
        title: 'Category',
        render: (val) => {
          return capitalizeFirstLetter(val.category);
        },
      },
      { accessor: 'applicationNumber', title: 'Application No.' },
      {
        accessor: 'status',
        title: 'Status',
        render: (val) => {
          return (
            <Badge
              size="xs"
              color={badgeBGColor[val.status]}
              className={'rounded-none flex items-center p-1.5'}
            >
              <Box c={badgeTextColor[val.status]}>{val.status}</Box>
            </Badge>
          );
        },
      },
    ],
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
            <Box className={`w-full`}>
              <ExpandableTable
                config={config}
                data={requestInfo.data?.services ?? []}
                total={requestInfo.data?.services.length ?? 0}
              />
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
