import { Flex, Select, Stack, TextInput } from '@mantine/core';
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
        <Select
          label="Form of Business"
          name="formOfBusiness"
          id="formOfBusiness"
          data={[
            {
              label: 'Sole Proprietorship',
              value: 'Sole Proprietorship',
            },
            {
              label: 'Partnership',
              value: 'Partnership',
            },
            {
              label: 'Private Limited Company',
              value: 'Private Limited Company',
            },
            {
              label: 'Share Company',
              value: 'Share Company',
            },
            {
              label: 'Government-Owned Enterprise',
              value: 'Government-Owned Enterprise',
            },
          ]}
          {...form.getInputProps(`basicRegistration.formOfBusiness`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="Business/Company Origin"
          name="businessCompanyOrigin"
          id="businessCompanyOrigin"
          {...form.getInputProps(`basicRegistration.businessCompanyOrigin`)}
        />
      </Stack>

      <Stack my={15}>
        <TextInput
          label="District"
          name="district"
          id="district"
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
          {...form.getInputProps(`basicRegistration.tinNumber`)}
        />
      </Stack>
      <Flex justify={'end'} p={20} gap={20}></Flex>
    </>
  );
};
