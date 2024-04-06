'use client';
import { useState } from 'react';
import { ActionIcon, Box, Flex, Text, TextInput } from '@mantine/core';
import { IconChevronRight, IconSearch } from '@tabler/icons-react';
import { ExpandableTable } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { useLazyRegistrationsQuery } from '../../_api/registration.api';
const MyTendersPage = () => {
  const [trigger, { data, isFetching }] = useLazyRegistrationsQuery();
  const router = useRouter();
  const config = {
    columns: [
      {
        accessor: 'tender.organizationName',
        title: 'Procuring Entity',
        render: (bookmark) => <Text>{bookmark.tender.organizationName}</Text>,
      },
      {
        accessor: 'tender.procurementReferenceNumber',
        title: 'Procurement Reference Number',
        render: (bookmark) => (
          <Text>{bookmark.tender.procurementReferenceNumber}</Text>
        ),
      },
      {
        accessor: 'tender.name',
        title: 'Name',
        render: (bookmark) => <Text>{bookmark.tender.name}</Text>,
      },
      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tender-workspace/${record.tender.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 100,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    primaryColumn: 'title',
    isFetching: isFetching,
  };
  const onRequestChange = (request: any) => {
    trigger(request);
  };
  return (
    <>
      <Box className="p-6 bg-[#e7f4f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-4 border-b-2">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              My Tenders
            </Text>
          </Flex>
          <ExpandableTable
            config={config}
            data={data?.items ?? []}
            total={data?.total ?? 0}
            onRequestChange={onRequestChange}
          />
        </Box>
      </Box>
    </>
  );
};

export default MyTendersPage;
