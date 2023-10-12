import { Flex, Stack, TextInput } from '@mantine/core';
import { IconLink, IconMapPin, IconPrinter } from '@tabler/icons-react';
import { IconAt, IconDeviceMobile, IconPhone } from '@tabler/icons-react';
import React from 'react';
import { IconMailbox } from '@tabler/icons-react';
import { PassFormDataProps } from './formShell';

export const AddressInformation: React.FC<PassFormDataProps> = ({
  register,
}) => {
  return (
    <Flex className="flex-wrap">
      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Postal Address"
          leftSection={<IconMailbox size={'1rem'} />}
          id="postalAddress"
          {...register(`address.postalAddress`)}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Primary Email"
          leftSection={<IconAt size={'1rem'} />}
          id="primaryEmail"
          {...register(`address.primaryEmail`)}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Alternate Email"
          leftSection={<IconAt size={'1rem'} />}
          id="alternateEmail"
          {...register(`address.alternateEmail`)}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Mobile Phone"
          leftSection={<IconDeviceMobile size={'1rem'} />}
          id="mobilePhone"
          {...register(`address.mobilePhone`)}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Telephone"
          leftSection={<IconPhone size={'1rem'} />}
          id="telephone"
          {...register(`address.telephone`)}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Fax"
          leftSection={<IconPrinter size={'1rem'} />}
          id="fax"
          {...register(`address.fax`)}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Website"
          leftSection={<IconLink size={'1rem'} />}
          id="website"
          {...register(`address.website`)}
        />
      </Flex>
    </Flex>
  );
};
