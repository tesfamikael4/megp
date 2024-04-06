'use client';
import { Box, Flex, Text, TextInput } from '@mantine/core';
import 'mantine-datatable/styles.layer.css';
import '@mantine/core/styles.layer.css';

import { IconSearch } from '@tabler/icons-react';
import { useDebouncedState } from '@mantine/hooks';
import Table from './_components/table';

function MyPayments() {
  const [search, setSearch] = useDebouncedState('', 500);

  return (
    <Box className="p-6 bg-[#e7f4f7]">
      <Box className=" w-full p-6 min-h-screen bg-white">
        <Flex direction={'column'} className="w-full py-2 mb-4 border-b-2">
          <Text fw={700} fz="xl" c={'#1D8E3F'}>
            Purchase Orders
          </Text>
          <Text c={'dimmed'} size={'14px'} mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
            faucibus, enim ac dictum rutrum, velit quam pharetra mi, aliquet
            interdum velit libero nec risus. Aliquam non libero dolor.
          </Text>
          <Flex justify="flex-end">
            <TextInput
              className="mb-2 w-80 h-8"
              leftSection={<IconSearch size={16} />}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
              }}
              placeholder="Search files by lorem, lorem"
              rightSectionWidth={30}
            />
          </Flex>
        </Flex>
        <Table />
      </Box>
    </Box>
  );
}

export default MyPayments;
