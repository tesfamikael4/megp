import { Flex, Group, Select, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { PassFormDataProps } from './formShell';
import { formOfBusiness, malawianDistricts } from '../../_constants';
import { getNationalityValues } from '../../new/_components/mockup/nationality';

export const BasicInfo: React.FC<PassFormDataProps> = ({ register }) => {
  return (
    <Stack>
      <Group grow>
        <TextInput
          label="Name of Business/Company"
          withAsterisk
          id="name"
          {...register(`basic.name`)}
        />
        <TextInput
          label="Tax Identification Number (TIN)"
          {...register(`basic.tinNumber`)}
          disabled
        />
      </Group>
      <Group grow>
        <Select
          label="Form of Business"
          withAsterisk
          data={formOfBusiness}
          {...register('basic.businessType', 'select')}
        />
        <Select
          label="Country of Registration"
          data={getNationalityValues()}
          {...register(`basic.origin`, 'select')}
          disabled
        />
      </Group>
      <Group grow>
        {register('basic.origin', 'select').value === 'Malawi' ? (
          <Select
            label="District"
            withAsterisk
            data={malawianDistricts}
            {...register(`basic.district`, 'select')}
            className="w-1/2"
          />
        ) : (
          <TextInput
            label="District/State/Region"
            {...register(`basic.district`)}
          />
        )}
      </Group>
    </Stack>
  );
};
