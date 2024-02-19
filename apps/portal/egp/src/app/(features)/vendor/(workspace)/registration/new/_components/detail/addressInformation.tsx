import { Group, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { PassFormDataProps } from './formShell';
import { Phone } from '@megp/core-fe';

export const AddressInformation: React.FC<PassFormDataProps> = ({
  register,
}) => {
  return (
    <Stack>
      <Group grow>
        <TextInput
          label="Postal Address/Zip code"
          // withAsterisk
          {...register(`address.postalAddress`)}
        />

        <TextInput
          label="Primary Email"
          withAsterisk
          {...register(`address.primaryEmail`)}
        />
      </Group>
      <Group grow>
        <TextInput
          label="Alternate Email"
          {...register(`address.alternateEmail`)}
        />
        {/* <Phone
          placeholder="Your phone"
          {...register(`address.mobilePhone`, 'select')}
        /> */}
        <TextInput
          withAsterisk
          label="Telephone 1"
          {...register(`address.mobilePhone`)}
        />
      </Group>
      <Group grow>
        <TextInput label="Telephone 2" {...register(`address.telephone`)} />

        <TextInput label="Fax" {...register(`address.fax`)} />
      </Group>
      <Group grow>
        <TextInput label="Website" {...register(`address.website`)} />
      </Group>
    </Stack>
  );
};
