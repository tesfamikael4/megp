'use client';
import React from 'react';
import { LoadingOverlay, Text } from '@mantine/core';
import { useGetApproveVendorInfoQuery } from '../_api/query';
import { Avatar, Badge, Box, Flex, Paper, ScrollArea } from '@mantine/core';
import { processCompanyName } from '../../../service/_util';
import { badgeBGColor, badgeTextColor } from '../../../_constants';
import FormPreview from '../../_components/review/form-preview';

export default function ProfileInfo() {
  const { data, isLoading } = useGetApproveVendorInfoQuery({});
  if (isLoading) return null;
  if (!data)
    return (
      <Box className="p-6 bg-[#e7f4f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-3 border-b-2">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              My Profile
            </Text>
          </Flex>
          <Flex align={'center'} justify={'center'}>
            <Text>No data! Go Back and finish your registration first</Text>
          </Flex>
        </Box>
      </Box>
    );
  const { initials, color } = processCompanyName(data?.basic?.name);
  return (
    <Box className="p-4">
      <Box className=" w-full min-h-screen bg-white  relative">
        <Paper className="p-4 pb-0">
          <Flex
            direction="row"
            className="flex items-center justify-between w-full border-b"
          >
            <Flex direction="row">
              <Box className="p-3">
                <Avatar color={'white'} radius="xl" size="lg" bg={color}>
                  {initials}
                </Avatar>
              </Box>
              <Flex
                direction="column"
                className="w-full text-sm justify-center"
              >
                <Box className="text-primary-800 font-bold" size="xl">
                  {data.basic.name}
                </Box>
                <Box>Country: {data.basic.origin}</Box>
              </Flex>
            </Flex>
          </Flex>
        </Paper>
        <ScrollArea className="h-screen w-full p-4">
          <FormPreview data={data} />
        </ScrollArea>
      </Box>
    </Box>
  );
}
