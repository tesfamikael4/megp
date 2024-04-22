import { Group, Select, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { PassFormDataProps } from './formShell';
import { malawianDistricts } from '../../_constants';

export const AddressInformation: React.FC<PassFormDataProps> = ({
  register,
  control,
}) => {
  return (
    <Stack>
      {/* <Group grow>
        <TextInput
          label="Physical Address"
          withAsterisk
          {...register(`address.countryOfRegistration`)}
          value={register(`basic.countryOfRegistration`).value}
          hidden
        />
      </Group> */}
      <Group grow>
        <TextInput
          label="Physical Address"
          withAsterisk
          {...register(`address.physicalAddress`)}
          disabled={
            register('basic.countryOfRegistration', 'select').value === 'Malawi'
          }
        />
        <TextInput
          label="Primary Email"
          withAsterisk
          {...register(`address.primaryEmail`)}
        />
      </Group>
      {register(`basic.countryOfRegistration`, 'select').value === 'Malawi' && (
        <Group grow>
          <Select
            withAsterisk
            label="Region"
            data={malawianDistricts}
            placeholder="Select region"
            {...register(`address.region`, 'select')}
          />
          <TextInput
            withAsterisk
            label="District"
            {...register(`address.district`)}
            onBlur={(data) => {
              if (!data)
                control.setError(`address.district`, {
                  message: 'Address is required',
                });
            }}
          />
        </Group>
      )}
      <Group grow>
        <TextInput
          label="Alternate Email"
          withAsterisk
          {...register(`address.alternateEmail`)}
        />
        <TextInput
          label="Telephone"
          {...register(`address.telephone`)}
          withAsterisk
        />
      </Group>
      <Group grow>
        <TextInput
          label="Postal Address/Zip code"
          withAsterisk
          {...register(`address.postalAddress`)}
          disabled={
            register('basic.countryOfRegistration', 'select').value === 'Malawi'
          }
        />
        <TextInput label="Fax" {...register(`address.fax`)} />
      </Group>
      <Group grow>
        <TextInput label="Website" {...register(`address.website`)} />
      </Group>
    </Stack>
  );
};
