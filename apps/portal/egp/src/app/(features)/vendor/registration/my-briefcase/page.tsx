import { Box, Flex, Paper, Text } from '@mantine/core';
import { IconCertificate, IconUserCircle } from '@tabler/icons-react';
import React from 'react';
function Page() {
  return (
    <Box className="p-4 bg-slate-100">
      <Box className=" w-full p-6 min-h-screen bg-white">
        <Flex className="flex flex-col  gap-3 w-full border-b">
          <Flex className="w-full py-2">
            <Text fw={700} fz="xl">
              My Briefcase
            </Text>
          </Flex>
        </Flex>
        <Flex className="gap-4 p-4">
          <Paper
            withBorder
            className="w-36 h-36 flex items-center justify-center flex-col gap-2"
          >
            <IconUserCircle size={40} stroke={1.3} />
            <Text fz={'sm'}>Profile Data</Text>
          </Paper>
          <Paper
            withBorder
            className="w-36 h-36 flex items-center justify-center flex-col gap-2 relative"
          >
            <IconCertificate size={40} stroke={1.1} />
            <Text fz={'sm'}>My Certificates</Text>
          </Paper>
        </Flex>
      </Box>
    </Box>
  );
}

export default Page;
