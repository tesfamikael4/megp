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
          required
          id="name"
          {...register(`basic.name`)}
        />
        <Select
          label="Form of Business"
          required
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
      </Group>
      <Group grow>
        <Select
          label="Business/Company Origin"
          data={getNationalityValues()}
          {...register(`basic.origin`, 'select')}
          disabled
        />
        <Select
          searchable
          label="Country"
          required
          data={getNationalityValues()}
          {...register(`basic.country`, 'select')}
        />
      </Group>
      <Group
        grow
        className={`${
          register('basic.country', 'select').value !== 'Malawi'
            ? 'w-1/2'
            : 'w-full flex gap-x-2'
        }`}
      >
        {register('basic.country', 'select').value === 'Malawi' && (
          <Select
            label="District"
            required
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
        )}
        <TextInput
          label="Tin Number"
          {...register(`basic.tinNumber`)}
          disabled
          className="w-1/2"
        />
      </Group>
    </Stack>
  );
};
