import { Flex, Group, Select, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { PassFormDataProps } from './formShell';
import { getNationalityValues } from '../../../../registration/new/_components/mockup/nationality';

export const BasicInfo: React.FC<PassFormDataProps> = ({ register }) => {
  return (
    <Stack>
      <Group grow>
        <TextInput
          label="Name of Business/Company"
          id="name"
          {...register(`basic.name`)}
          withAsterisk
          // required
        />
        <Select
          label="Form of Business"
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
          withAsterisk
          required
        />
      </Group>
      <Group grow>
        <Select
          label="Business/Company Origin"
          data={getNationalityValues()}
          {...register(`basic.origin`, 'select')}
          disabled
        />
        {register('basic.origin', 'select').value == 'Malawi' && (
          <Select
            label="District"
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
            withAsterisk
            required
            {...register(`basic.district`, 'select')}
          />
        )}
      </Group>
      <Group grow>
        <Select
          searchable
          label="Country"
          data={getNationalityValues()}
          {...register(`basic.country`, 'select')}
          withAsterisk
          required
        />
        <TextInput
          label="Tin Number"
          {...register(`basic.tinNumber`)}
          disabled
        />
      </Group>
    </Stack>
  );
};
