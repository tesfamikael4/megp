'use client';
import React from 'react';
import {
  Select,
  Checkbox,
  Button,
  Flex,
  Text,
  Stack,
  NumberInput,
  Divider,
  TextInput,
  Box,
} from '@mantine/core';
import style from './register.module.scss';
import { nationalityOptions } from '../../../../_shared/config';
import { useRouter } from 'next/navigation';
import { createQueryString } from '@/app/(home)/egp/vendors/_shared/lib/url/helper';
interface Props {
  form: any;
}

export const RegisterVendorRequestForm: React.FC<Props> = ({ form }) => {
  const router = useRouter();
  const handleSubmit = (values: typeof form.values) => {
    router.push(
      'rs-new-form?' + createQueryString(values.requesterInformation),
    );
  };

  return (
    <Box className={style.reqFormCard}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack my={15}>
          <TextInput
            label="Company Name"
            {...form.getInputProps(`requesterInformation.companyName`)}
          />
        </Stack>
        <Stack my={15}>
          <Select
            label="Legal Form of Entity"
            required
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
            {...form.getInputProps(`requesterInformation.legalFormOfEntity`)}
          />
        </Stack>
        <Stack my={15}>
          <Select
            label="Country of Registration"
            placeholder="Select country"
            data={nationalityOptions}
            {...form.getInputProps(
              `requesterInformation.countryOfRegistration`,
            )}
            searchable
          />
        </Stack>
        <Stack my={15}>
          {form.values.requesterInformation.countryOfRegistration === 'MW' && (
            <NumberInput
              label="Tax Identification Number"
              {...form.getInputProps(`requesterInformation.tinNumber`)}
            />
          )}
        </Stack>

        <Divider size="md" mt={30} />

        <Stack my={10}>
          <Flex>
            <Checkbox
              {...form.getInputProps(
                `requesterInformation.termsAndConditions`,
                { type: 'checkbox' },
              )}
            />
            <Text size={'sm'}>
              By continuing using the system you certify that you have read the
              above service request instruction and accept the applicable Terms
              and Conditions
            </Text>
          </Flex>
        </Stack>
        <Flex className="mt-10 justify-end">
          <Button type="submit">Start Registration</Button>
        </Flex>
      </form>
    </Box>
  );
};
