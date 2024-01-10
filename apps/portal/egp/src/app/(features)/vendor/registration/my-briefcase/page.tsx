import { Box, Flex, Paper, Text } from '@mantine/core';
import { IconCertificate, IconUserCircle } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';
function Page() {
  return (
    <Box className="p-4 bg-[#f7f7f7]">
      <Box className=" w-full p-6 min-h-screen bg-white">
        <Flex className="flex flex-col  gap-3 w-full border-b">
          <Flex className="w-full py-2">
            <Text fw={700} fz="xl">
              My Briefcase
            </Text>
          </Flex>
        </Flex>
        <Flex className="gap-4 p-4">
          <Link href={'/vendor/registration/my-briefcase/profile'}>
            <Paper
              withBorder
              className="w-36 h-36 flex items-center justify-center flex-col gap-2 hover:shadow-md"
            >
              <IconUserCircle size={40} stroke={1.3} />
              <Text fz={'sm'}>Profile Data</Text>
              <Flex></Flex>
            </Paper>
          </Link>
          <Link href={'/vendor/registration/my-briefcase/my-certificates'}>
            <Paper
              withBorder
              className="w-36 h-36 flex items-center justify-center flex-col gap-2 hover:shadow-md"
            >
              <IconCertificate size={40} stroke={1.1} />
              <Text fz={'sm'}>My Certificates</Text>
            </Paper>
          </Link>
        </Flex>
      </Box>
    </Box>
  );
}

export default Page;
