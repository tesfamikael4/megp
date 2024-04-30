'use client';

import React, { useEffect } from 'react';
import Entity from './_components/Entity';
import { Box, Container, Group, LoadingOverlay } from '@mantine/core';
import { IconBriefcase, IconFileCheck, IconFolder } from '@tabler/icons-react';
import { Avatar } from '@mantine/core';
import { useGetReportsQuery } from '../_api/reports';
import { InfoCard } from '../my-workspace/_components/card';
import { addSpacesToCamelCase } from '../my-workspace/registration/_components/review/utils';

const infoCard = {
  ibm: (
    <Avatar color="#81D49A" variant="filled" radius={10}>
      <IconFolder size={32} stroke={1.5} className="text-white" />
    </Avatar>
  ),

  activeVendors: (
    <Avatar
      styles={{
        placeholder: {
          background: '#F6C488',
        },
      }}
      variant="filled"
      radius={10}
    >
      <IconBriefcase size={32} stroke={1.5} className="text-white" />
    </Avatar>
  ),

  marginalizedGroup: (
    <Avatar
      styles={{
        placeholder: {
          background: '#9CBEFF',
        },
      }}
      variant="filled"
      radius={10}
    >
      <IconFileCheck size={32} stroke={1.5} className="text-white" />
    </Avatar>
  ),

  debardVendors: (
    <Avatar
      styles={{
        placeholder: {
          background: '#fe435d',
        },
      }}
      variant="filled"
      radius={10}
    >
      <IconFileCheck size={32} stroke={1.5} className="text-white" />
    </Avatar>
  ),
};

const VendorsList = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetReportsQuery({});
  const whitelist = [
    'activeVendors',
    'ibm',
    'marginalizedGroup',
    'debardVendors',
  ];

  if (isLoading) <LoadingOverlay />;

  return (
    <Container size={'xl'}>
      {data && (
        <Box mt={'md'}>
          <Group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
            {Object.keys(data).map((key) => {
              if (whitelist.includes(key))
                return (
                  <InfoCard
                    key={key}
                    icon={infoCard[key]}
                    title={addSpacesToCamelCase(key)}
                    count={data[key]}
                  />
                );
            })}
          </Group>
        </Box>
      )}
      <Entity>{children}</Entity>
    </Container>
  );
};

export default VendorsList;
