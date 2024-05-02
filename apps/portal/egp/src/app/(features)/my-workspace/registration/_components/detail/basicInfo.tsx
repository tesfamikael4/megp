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
          label="Taxpayer Identification Number (TIN)"
          {...register(`basic.tinNumber`)}
          disabled
        />
        <Select
          label="Country of Registration"
          data={getNationalityValues()}
          {...register(`basic.countryOfRegistration`, 'select')}
          disabled
        />
      </Group>
      <Group grow>
        <TextInput
          label={`Name of Business/Company ${register(`basic.countryOfRegistration`, 'select').value === 'Malawi' ? '(from MBRS)' : ''}`}
          withAsterisk
          id="name"
          {...register(`basic.name`)}
          disabled
        />
        <Select
          label="Form of Business"
          withAsterisk
          data={formOfBusiness}
          {...register('basic.businessType', 'select')}
        />
      </Group>
      {register(`basic.countryOfRegistration`).value === 'Malawi' && (
        <Group grow>
          <TextInput
            label="Registration Number"
            {...register(`basic.registrationNumber`)}
            disabled
          />
        </Group>
      )}
    </Stack>
  );
};
