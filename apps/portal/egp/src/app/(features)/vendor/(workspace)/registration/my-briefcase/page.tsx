import { Box, Button, Flex, Text, TextInput } from '@mantine/core';
import React from 'react';
import ProfileData from './_components/profileData';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import MyCertificates from './_components/certificate-data';
// import { useDebouncedState } from '@mantine/hooks';

function Page() {
  // const [search, setSearch] = useDebouncedState('', 500);
  return (
    <Box className="p-4 bg-[#f7f7f7]">
      <Box className=" w-full p-6 min-h-screen bg-white">
        <Flex direction={'column'} className="w-full py-2 border-b">
          <Flex justify={'space-between'}>
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              My Briefcase
            </Text>
            <Button leftSection={<IconPlus size={16} stroke={2.2} />}>
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
              // onChange={(event) => {
              //   setSearch(event.currentTarget.value);
              // }}
              placeholder="Search files by lorem, lorem"
              rightSectionWidth={30}
            />
          </Flex>
        </Flex>
        <ProfileData />
        <MyCertificates />
      </Box>
    </Box>
  );
}

export default Page;
