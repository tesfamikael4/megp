import { Stack, TextInput } from '@mantine/core';
import { IconLink, IconMapPin, IconPrinter } from '@tabler/icons-react';
import { IconAt, IconDeviceMobile, IconPhone } from '@tabler/icons-react';
import React from 'react';
import { CouplerPanel } from '../../../../_shared/components';
import { IconMailbox } from '@tabler/icons-react';

interface Props {
  form: any;
}

export const AddressInformation: React.FC<Props> = ({ form }) => {
  return (
    <>
      <Stack my={15}>
        <TextInput
          label="Postal Address"
          icon={<IconMailbox size={'1rem'} />}
          id="postalAddress"
          {...form.getInputProps(`addressInformation.postalAddress`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Primary Email"
          icon={<IconAt size={'1rem'} />}
          id="primaryEmail"
          {...form.getInputProps(`addressInformation.primaryEmail`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Alternate Email"
          icon={<IconAt size={'1rem'} />}
          id="alternateEmail"
          {...form.getInputProps(`addressInformation.alternateEmail`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Mobile Phone"
          icon={<IconDeviceMobile size={'1rem'} />}
          id="mobilePhone"
          {...form.getInputProps(`addressInformation.mobilePhone`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Telephone"
          icon={<IconPhone size={'1rem'} />}
          id="telephone"
          {...form.getInputProps(`addressInformation.telephone`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Fax"
          icon={<IconPrinter size={'1rem'} />}
          id="fax"
          {...form.getInputProps(`addressInformation.fax`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Website"
          icon={<IconLink size={'1rem'} />}
          id="website"
          {...form.getInputProps(`addressInformation.website`)}
        />
      </Stack>

      <Stack my={15}>
        <CouplerPanel label="Geo Location" id="geoLocation">
          <Stack my={15}>
            <TextInput
              label="x-coordinate"
              icon={<IconMapPin size={'1rem'} />}
              id="xCoordinate"
              {...form.getInputProps(
                `addressInformation.geoLocation.xCoordinate`,
              )}
            />
          </Stack>

          <Stack my={15}>
            <TextInput
              label="y-coordinate"
              icon={<IconMapPin size={'1rem'} />}
              id="yCoordinate"
              {...form.getInputProps(
                `addressInformation.geoLocation.yCoordinate`,
              )}
            />
          </Stack>
        </CouplerPanel>
      </Stack>
    </>
  );
};
