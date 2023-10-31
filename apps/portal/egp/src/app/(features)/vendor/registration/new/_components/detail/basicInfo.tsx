import { Flex, Group, Select, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { PassFormDataProps } from './formShell';

export const BasicInfo: React.FC<PassFormDataProps> = ({ register }) => {
  return (
    <Stack>
      <Group grow>
        <TextInput
          required
          label="Name of Business/Company"
          id="name"
          {...register(`basic.name`)}
        />
        <Select
          required
          label="Form of Business"
          searchable
          data={[
            {
              label: 'Sole Proprietorship',
              value: 'Sole Proprietorship',
            },
            {
              label: 'Partnership',
              value: 'Partnership',
            },
            {
              label: 'Private Limited Company',
              value: 'Private Limited Company',
            },
            {
              label: 'Share Company',
              value: 'Share Company',
            },
            {
              label: 'Government-Owned Enterprise',
              value: 'Government-Owned Enterprise',
            },
          ]}
          {...register('basic.businessType', 'select')}
        />
      </Group>
      <Group grow>
        <TextInput
          required
          label="Business/Company Origin"
          {...register(`basic.origin`)}
        />
        <TextInput label="District" {...register(`basic.district`)} />
      </Group>
      <Group grow>
        <TextInput required label="Country" {...register(`basic.country`)} />
        <TextInput
          required
          label="Tin Number"
          {...register(`basic.tinNumber`)}
        />
      </Group>
    </Stack>
  );
};
