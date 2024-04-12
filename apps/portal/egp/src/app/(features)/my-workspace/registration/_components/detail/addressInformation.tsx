import { Group, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { PassFormDataProps } from './formShell';

export const AddressInformation: React.FC<PassFormDataProps> = ({
  register,
}) => {
  return (
    <Stack>
      <Group grow>
        <TextInput
          label="Primary Email"
          withAsterisk
          {...register(`address.primaryEmail`)}
        />
        <TextInput
          withAsterisk
          label="Telephone 1"
          {...register(`address.mobilePhone`)}
        />
      </Group>
      <Group grow>
        <TextInput
          label="Alternate Email"
          {...register(`address.alternateEmail`)}
        />
        <TextInput label="Telephone 2" {...register(`address.telephone`)} />
      </Group>
      <Group grow>
        <TextInput
          label="Postal Address/Zip code"
          {...register(`address.postalAddress`)}
          disabled={
            register('basic.origin', 'select').value === 'Malawi' ||
            register(`address.postalAddress`).disabled
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
