import { Flex, Stack, TextInput } from '@mantine/core';
import React from 'react';

interface Props {
  form: any;
}
export const BasicRegistration: React.FC<Props> = ({ form }) => {
  return (
    <>
      <Stack my={15}>
        <TextInput
          label="Name of Business/Company"
          name="nameOfBusinessCompany"
          id="nameOfBusinessCompany"
          disabled
          {...form.getInputProps(`basicRegistration.nameOfBusinessCompany`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Form of Business"
          name="formOfBusiness"
          id="formOfBusiness"
          disabled
          {...form.getInputProps(`basicRegistration.formOfBusiness`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Business/Company Origin"
          name="businessCompanyOrigin"
          id="businessCompanyOrigin"
          disabled
          {...form.getInputProps(`basicRegistration.businessCompanyOrigin`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="District"
          name="district"
          id="district"
          disabled
          {...form.getInputProps(`basicRegistration.district`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Country"
          name="country"
          id="country"
          disabled
          {...form.getInputProps(`basicRegistration.country`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Tin Number"
          name="tinNumber"
          id="tinNumber"
          disabled
          {...form.getInputProps(`basicRegistration.tinNumber`)}
        />
      </Stack>
      <Flex justify={'end'} p={20} gap={20}></Flex>
    </>
  );
};
