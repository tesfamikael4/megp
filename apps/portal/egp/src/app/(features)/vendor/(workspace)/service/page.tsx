'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  ComboboxData,
  Flex,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core';
import { useGetVendorQuery } from '../registration/_api/query';
import FormPreview from '../registration/new/_components/review/form-preview';
import { useRouter } from 'next/navigation';
import { processCompanyName } from './_util';

const services: ComboboxData = [
  {
    label: 'Renew registration',
    value: '/vendor/registration/renewal/ppda',
  },
  {
    label: 'Upgrade registration',
    value: '/vendor/registration/upgrade/business-areas',
  },
  {
    label: 'Profile update',
    value: '/vendor/registration/profile-update',
  },
  {
    label: 'IBM',
    value: '/vendor/registration/preferential-treatment/ibm',
  },
  {
    label: 'MSME',
    value: '/vendor/registration/preferential-treatment/msme',
  },
  {
    label: 'Add Additional Services',
    value: '/vendor/registration/',
  },
];

const badgeBGColor: { [key: string]: string } = {
  Rejected: `red.0`,
  Submitted: `blue.0`,
  Adjustment: `yellow.0`,
  Completed: `green.0`,
  Pending: `blue.0`,
  Outdated: `orange.0`,
};
const badgeTextColor: { [key: string]: string } = {
  Rejected: `red.6`,
  Submitted: `blue.6`,
  Adjustment: `yellow.6`,
  Completed: `green.6`,
  Pending: `blue.6`,
  Outdated: `orange.6`,
};

const ServiceLayout = () => {
  const { data, isLoading, isSuccess } = useGetVendorQuery({});
  const router = useRouter();

  if (isLoading) return <LoadingOverlay visible={isLoading} />;
  if (isSuccess && data && data.status === 'Approved')
    return <ApprovedPageData data={data} />;
  if (isSuccess && data && data.status === 'Active')
    return router.push('/vendor/registration/new/detail');
  if (isSuccess && data && data.status === 'Submitted')
    return <ApprovedPageData data={data} />;
  return (
    <Box className="p-4">
      <Box className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <Box className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-blue-500 rounded-full bg-blue-50 dark:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            New Registration
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Start your procurement journey Here{' '}
          </p>

          <Box className="flex items-center w-full mt-4 gap-x-3 shrink-0 sm:w-auto">
            <Button
              className="w-1/2 px-5 text-sm tracking-wide text-white transition-colors duration-200 shrink-0 sm:w-auto "
              onClick={() => router.push('/vendor/registration/new/basic')}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceLayout;

const ApprovedPageData = ({ data }: any) => {
  const [value, setValue] = useState<null | string>(null);
  const router = useRouter();
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
                <Avatar color={color} radius="xl" size="lg" bg={'red'}>
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
                color={badgeBGColor[data.status]}
                className={
                  'rounded-none flex items-center p-1.5 absolute top-0 right-0'
                }
              >
                <Box c={badgeTextColor[data.status]}>{data.status}</Box>
              </Badge>
              {data.status === 'Approved' && (
                <Flex align={'center'} gap={'sm'} className="mb-1 mt-2">
                  <Select
                    placeholder="Select a Service"
                    data={services}
                    onChange={(e) => setValue(e)}
                    label="Select a Service"
                  />
                  <Button
                    disabled={!value}
                    onClick={() => router.push(value ?? '')}
                    className="mt-5"
                  >
                    Apply
                  </Button>
                </Flex>
              )}
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
