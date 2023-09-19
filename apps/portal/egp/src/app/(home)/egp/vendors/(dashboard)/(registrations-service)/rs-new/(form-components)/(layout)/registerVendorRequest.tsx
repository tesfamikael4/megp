'use client';
import React from 'react';
import {
  Select,
  Checkbox,
  Button,
  Flex,
  Text,
  Stack,
  Group,
  NumberInput,
  Divider,
  LoadingOverlay,
  TextInput,
  Box,
} from '@mantine/core';
import style from './layout.module.scss';
import { nationalityOptions } from '../../../../../_shared/config';
import { useRouter } from 'next/navigation';

interface Props {
  form: any;
}

export const RegisterVendorRequestForm: React.FC<Props> = ({ form }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  // Create a function to handle the form submission
  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    // setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);

      router.push('rs-new-form');
    }, 3000); // 5000 milliseconds = 5 seconds
  };
  return (
    <Box className={style.reqFormCard}>
      <LoadingOverlay visible={isVisible} overlayBlur={1} />
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
          <Flex align={'center'} gap={10}>
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
        <Group position={'right'} mt="xl">
          <Button type="submit">Start Registration</Button>
        </Group>
      </form>
    </Box>
  );
};
