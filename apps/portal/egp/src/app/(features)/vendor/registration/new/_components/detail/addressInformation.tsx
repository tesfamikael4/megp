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
          label="Postal Address"
          {...register(`address.postalAddress`)}
        />

        <TextInput
          label="Primary Email"
          {...register(`address.primaryEmail`)}
        />
      </Group>
      <Group grow>
        <TextInput
          label="Alternate Email"
          {...register(`address.alternateEmail`)}
        />

        <TextInput label="Mobile Phone" {...register(`address.mobilePhone`)} />
      </Group>
      <Group grow>
        <TextInput label="Telephone" {...register(`address.telephone`)} />

        <TextInput label="Fax" {...register(`address.fax`)} />
      </Group>
      <Group grow>
        <TextInput label="Website" {...register(`address.website`)} />
      </Group>
    </Stack>
  );
};
