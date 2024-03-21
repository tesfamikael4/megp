'use client';

import { Box, Flex, TextInput, LoadingOverlay } from '@mantine/core';
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import { ExpandableTable, ExpandableTableConfig } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import UploadModal from './_components/upload-modal';
import DocumentDetail from './_components/document-detail';
import { useLazyGetBriefcaseFilesQuery } from '../_api/query';
// import { useDebouncedState } from '@mantine/hooks';

function Page() {
  const [row, setRow] = useState(null);
  const [opened, { close, open }] = useDisclosure();
  const config: ExpandableTableConfig = {
    columns: [
      {
        accessor: 'name',
        title: 'Name',
        render: (record) => {
          return record.attachmentId?.substring(
            0,
            record?.attachmentId?.indexOf('.'),
          );
        },
      },
      {
        accessor: 'size',
        title: 'Size',
      },
      {
        accessor: 'type',
        title: 'File Type',
        render: (record) => {
          return record.attachmentId?.substring(
            record?.attachmentId?.indexOf('.') + 1,
          );
        },
      },
    ],
    onClick: ({ record }) => {
      setRow(record);
    },
  };

  const [fetch, { data, isLoading }] = useLazyGetBriefcaseFilesQuery();
  useEffect(() => {
    fetch({});
  }, []);

  if (isLoading) <LoadingOverlay />;
  return (
    <>
      <UploadModal opened={opened} close={close} fetch={fetch} />
      <Box className="p-4 bg-[#f7f7f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 border-b">
            <Flex justify={'space-between'}>
              <Text fw={700} fz="xl" c={'#1D8E3F'}>
                My Briefcase
              </Text>
              <Button
                leftSection={<IconPlus size={16} stroke={2.2} />}
                onClick={open}
              >
                Add
              </Button>
            </Flex>
            <Text c={'dimmed'} size={'14px'} mt={2}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              faucibus, enim ac dictum rutrum, velit quam pharetra mi, aliquet
              interdum velit libero nec risus. Aliquam non libero dolor.
            </Text>
            <Flex justify="flex-end">
              <TextInput
                className="mb-2 w-80 h-8"
                leftSection={<IconSearch />}
                placeholder="Search files by lorem, lorem"
                rightSectionWidth={30}
              />
            </Flex>
          </Flex>
          <Flex mt={'md'}>
            <Box miw={row ? '60%' : '100%'}>
              <ExpandableTable config={config} data={data as any[]} />
            </Box>
            {row && <DocumentDetail row={row} setRow={setRow} />}
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export default Page;
