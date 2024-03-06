'use client';

import { Box, Flex, TextInput } from '@mantine/core';
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import React, { useState } from 'react';
import { IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import { ExpandableTable } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import UploadModal from './_components/upload-modal';
import DocumentDetail from './_components/document-detail';
// import { useDebouncedState } from '@mantine/hooks';

function Page() {
  const [row, setRow] = useState(null);
  const [opened, { close, open }] = useDisclosure();
  const config = {
    columns: [
      {
        accessor: 'name',
        title: 'Name',
      },
      {
        accessor: 'size',
        title: 'Size',
      },
      { accessor: 'type', title: 'File Type' },
    ],
    onClick: ({ record }) => {
      setRow(record);
    },
  };

  return (
    <>
      <UploadModal opened={opened} close={close} />
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
          <Flex gap={'lg'} mt={'md'}>
            <Box miw={row ? '70%' : '100%'}>
              <ExpandableTable
                config={config}
                data={[
                  {
                    name: 'certificate1.pdf',
                    size: '10 MB',
                    type: 'PDF',
                  },
                  {
                    name: 'certificate2.pdf',
                    size: '10 MB',
                    type: 'PDF',
                  },
                  {
                    name: 'certificate3.pdf',
                    size: '10 MB',
                    type: 'PDF',
                  },
                  {
                    name: 'certificate4.pdf',
                    size: '10 MB',
                    type: 'PDF',
                  },
                ]}
              />
            </Box>
            {row && <DocumentDetail row={row} setRow={setRow} />}
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export default Page;
