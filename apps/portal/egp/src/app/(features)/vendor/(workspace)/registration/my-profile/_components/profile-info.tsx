'use client';
import React from 'react';
import { Divider, Text } from '@mantine/core';
import { useGetApproveVendorInfoQuery } from '../_api/query';
import { Box, Flex, Paper, ScrollArea } from '@mantine/core';
import FormPreview from '../../_components/review/form-preview';
import { addSpacesToCamelCase } from '../../_components/review/addSpaceToCamelCase';

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

  return (
    <Box className="p-4">
      <Box className=" w-full min-h-screen bg-white  relative">
        <Paper className="p-7">
          <Flex direction="column" className="w-full text-sm justify-center">
            <Flex align="center" columnGap={4}>
              <Text className="text-primary-800 font-bold" size="xl">
                {data.basic.name}
              </Text>
              ({data.basic.origin})
            </Flex>
            <Text size="md">
              {addSpacesToCamelCase(data.basic?.businessType)}
            </Text>
          </Flex>
        </Paper>
        <Divider />
        <ScrollArea className="h-screen w-full p-4">
          <FormPreview data={data} />
        </ScrollArea>
      </Box>
    </Box>
  );
}
