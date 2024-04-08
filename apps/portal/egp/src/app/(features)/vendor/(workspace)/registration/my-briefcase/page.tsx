'use client';

import { Box, Flex, TextInput, LoadingOverlay } from '@mantine/core';
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import { ExpandableTable, ExpandableTableConfig } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import UploadModal from './_components/upload-modal';
import DocumentDetail from './_components/document-detail';
import {
  useGetApproveVendorInfoQuery,
  useLazyGetBriefcaseFilesQuery,
} from '../_api/query';
import PageWrapper from '../../../_components/page-wrapper';
import { MyBriefcaseIcon } from './_components/placeholder-icon';
// import { useDebouncedState } from '@mantine/hooks';
function Page() {
  const [row, setRow] = useState(null);
  const { data: vendor } = useGetApproveVendorInfoQuery({});
  const [opened, { close, open }] = useDisclosure();
  const config: ExpandableTableConfig = {
    columns: [
      {
        accessor: 'name',
        title: 'Name',
        render: (record) => {
          return record?.attachmentId?.substring(
            0,
            record?.attachmentId?.indexOf('.'),
          );
        },
      },
      {
        accessor: 'type',
        title: 'File Type',
        render: (record) => {
          return record?.attachmentId?.substring(
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

  return (
    <>
      <UploadModal opened={opened} close={close} fetch={fetch} />
      <PageWrapper
        title="My Briefcase"
        info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
            faucibus, enim ac dictum rutrum, velit quam pharetra mi, aliquet
            interdum velit libero nec risus. Aliquam non libero dolor."
        actions={
          <TextInput
            size="xs"
            maw={300}
            w="100%"
            leftSection={<IconSearch size={18} />}
            placeholder="Search files by lorem, lorem"
            rightSectionWidth={30}
          />
        }
        headerRight={
          vendor && (
            <Button
              leftSection={<IconPlus size={16} stroke={2.2} />}
              onClick={open}
            >
              Add
            </Button>
          )
        }
        condition={data && data.length > 0}
        isLoading={isLoading}
        placeholder={
          <Flex className=" flex-col gap-3 w-full h-full flex items-center justify-center mt-24">
            <MyBriefcaseIcon />
            <Text fw={500} fz={18}>
              Get Started!
            </Text>
            <Text fw={500} fz={14} c="#464665">
              No documents have been added!
            </Text>
            {vendor && <Button variant="outline">Add Documents</Button>}
          </Flex>
        }
        headerBorder
      >
        <Flex mt={'md'}>
          <Box miw={row ? '60%' : '100%'}>
            <ExpandableTable config={config} data={data as any[]} />
          </Box>
          {row && <DocumentDetail row={row} setRow={setRow} fetch={fetch} />}
        </Flex>
      </PageWrapper>
    </>
  );
}

export default Page;
