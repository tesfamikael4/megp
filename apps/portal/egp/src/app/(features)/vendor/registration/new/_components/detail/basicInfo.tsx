import { Group, Select, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { Districts } from '../mockup/district';
import { FormOfBusiness } from '../mockup/form-of-business';
import { getNationalityValues } from '../mockup/nationality';
import { PassFormDataProps } from './formShell';
export const BasicInfo: React.FC<PassFormDataProps> = ({ register }) => {
  return (
    <Stack>
      {register('basic.country', 'select').value === 'Malawi' ? (
        <>
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

            <Select
              label="District"
              withAsterisk
              data={Districts}
              {...register(`basic.district`, 'select')}
              className="w-1/2"
            />
          </Group>
        </>
      ) : (
        <>
          <Group grow>
            <TextInput
              label="Name of Business/Company"
              withAsterisk
              id="name"
              {...register(`basic.name`)}
            />
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
          </Group>

          <Group grow>
            <Select
              label="Country of Registration"
              data={getNationalityValues()}
              {...register(`basic.origin`, 'select')}
              disabled
            />
            <Select
              searchable
              label="Country"
              withAsterisk
              data={getNationalityValues()}
              {...register(`basic.country`, 'select')}
            />
          </Group>
          <TextInput label="District/State/Region" className="w-1/2" />
        </>
      )}
    </Stack>
  );
};
