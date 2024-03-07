import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGetVendorQuery } from '../../registration/_api/query';
import { processCompanyName } from '../_util';
import { Avatar, Badge, Box, Flex, Paper, ScrollArea } from '@mantine/core';
import { badgeBGColor, badgeTextColor } from '../../_constants';
import FormPreview from '../../registration/_components/review/form-preview';

export const SubmittedApplication = () => {
  const [value, setValue] = useState<null | string>(null);
  const router = useRouter();

  const { data, isLoading } = useGetVendorQuery({});
  if (isLoading) return null;
  if (!data) return null;
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
            <Flex align={'center'} gap={'sm'} className="mb-1 mt-2">
              <Badge
                size="md"
                color={badgeBGColor['Submitted']}
                className={
                  'rounded-none flex items-center p-1.5 absolute top-0 right-0'
                }
              >
                <Box c={badgeTextColor['Submitted']}>{'Submitted'}</Box>
              </Badge>
            </Flex>
          </Flex>
        </Paper>
        <ScrollArea className="h-screen w-full p-4">
          <FormPreview data={data} />
        </ScrollArea>
      </Box>
    </Box>
  );
};
