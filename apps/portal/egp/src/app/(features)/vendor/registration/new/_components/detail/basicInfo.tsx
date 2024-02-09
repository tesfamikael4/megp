import { Flex, Group, Select, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { PassFormDataProps } from './formShell';
import { getNationalityValues } from '../mockup/nationality';

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
          className="w-1/2"
        />
      </Group>
      <Group grow>
        <Select
          label="Form of Business"
          withAsterisk
          data={[
            {
              label: 'Sole Proprietorship',
              value: 'soleProprietorship',
            },
            {
              label: 'Partnership',
              value: 'partnership',
            },
            {
              label: 'Private Limited Company',
              value: 'privateLimitedCompany',
            },
            {
              label: 'ShareCompany',
              value: 'shareCompany',
            },
            {
              label: 'Government-Owned Enterprise',
              value: 'governmentOwnedEnterprise',
            },
          ]}
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
        <Select
          searchable
          label="Country"
          withAsterisk
          data={getNationalityValues()}
          {...register(`basic.country`, 'select')}
        />
        {register('basic.country', 'select').value === 'Malawi' ? (
          <Select
            label="District"
            withAsterisk
            data={[
              'Balaka',
              'Blantyre',
              'Chikwawa',
              'Chiradzulu',
              'Chitipa',
              'Dedza',
              'Dowa',
              'Karonga',
              'Kasungu',
              'Likoma',
              'Lilongwe',
              'Machinga',
              'Mangochi',
              'Mchinji',
              'Mulanje',
              'Mwanza',
              'Mzimba',
              'Neno',
              'Nkhata Bay',
              'Nkhotakota',
              'Nsanje',
              'Ntcheu',
              'Ntchisi',
              'Phalombe',
              'Rumphi',
              'Salima',
              'Thyolo',
              'Zomba',
            ]}
            {...register(`basic.district`, 'select')}
            className="w-1/2"
          />
        ) : (
          <TextInput label="District/State/Region" />
        )}
      </Group>
    </Stack>
  );
};
