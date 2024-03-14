import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGetVendorQuery } from '../../registration/_api/query';
import { processCompanyName } from '../_util';
import { Box, Flex, Paper, ScrollArea, Divider, Text } from '@mantine/core';
import FormPreview from '../../registration/_components/review/form-preview';
import { addSpacesToCamelCase } from '../../registration/_components/review/addSpaceToCamelCase';

export const SubmittedApplication = () => {
  const { data, isLoading } = useGetVendorQuery({});
  if (isLoading) return null;
  if (!data) return null;
  return (
    <Box className="p-4">
      <Box className=" w-full h-full bg-white  relative">
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
};
