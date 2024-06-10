import {
  Fieldset,
  Flex,
  Group,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';
import React from 'react';
import { IconCash, IconChevronDown } from '@tabler/icons-react';
import { Select } from '@mantine/core';
import { PassFormDataProps } from './formShell';
import { useGetCurrenciesQuery } from '@/store/api/administrationApi';
import { Controller } from 'react-hook-form';

export const BusinessSizeAndOwnership: React.FC<PassFormDataProps> = ({
  register,
  control,
}) => {
  const { data: currencies, isLoading, isError } = useGetCurrenciesQuery({});
  return (
    <Stack>
      <Group grow>
        <Controller
          name="businessSizeAndOwnership.registeredCapital.amount"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Registered Capital"
              withAsterisk
              rightSectionWidth="80px"
              rightSection={
                <Controller
                  name="businessSizeAndOwnership.registeredCapital.currency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      leftSection={<IconCash size={'1.3rem'} />}
                      data={['USD', 'ETB', 'EUR', 'GBP', 'MKW']}
                      placeholder="select"
                      {...register(
                        'businessSizeAndOwnership.registeredCapital.currency',
                        'select',
                      )}
                      // rightSection={<><IconChevronDown size={'1.3rem'} /></>}
                      rightSectionWidth={0}
                      error={false}
                      onChange={(value) => {
                        register(
                          'businessSizeAndOwnership.paidUpCapital.currency',
                          'select',
                        ).onChange(value);
                        register(
                          'businessSizeAndOwnership.registeredCapital.currency',
                          'select',
                        ).onChange(value);
                      }}
                    />
                  )}
                />
              }
              {...field}
              error={
                register('businessSizeAndOwnership.registeredCapital.amount')
                  .error ||
                register(
                  'businessSizeAndOwnership.registeredCapital.currency',
                  'select',
                ).error
              }
              thousandSeparator
              decimalScale={2}
              min={1}
              max={100000000000000000}
            />
          )}
        />
        <Controller
          name="businessSizeAndOwnership.paidUpCapital.amount"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Paid Up Capital"
              rightSectionWidth="80px"
              withAsterisk
              rightSection={
                <Select
                  leftSection={<IconCash size={'1.3rem'} />}
                  data={['USD', 'ETB', 'EUR', 'GBP', 'KW']}
                  placeholder="select"
                  {...register(
                    'businessSizeAndOwnership.registeredCapital.currency',
                    'select',
                  )}
                  rightSection={<></>}
                  rightSectionWidth={0}
                  error={false}
                  disabled
                />
              }
              {...field}
              error={
                register(
                  `businessSizeAndOwnership.paidUpCapital.amount`,
                  'number',
                ).error ||
                register(
                  'businessSizeAndOwnership.paidUpCapital.currency',
                  'select',
                ).error
              }
              thousandSeparator
              decimalScale={2}
              min={1}
              max={
                register('businessSizeAndOwnership.registeredCapital.amount')
                  .value
              }
            />
          )}
        />
      </Group>
      <Group grow>
        <TextInput
          className="w-1/2"
          label="Number of Employees"
          id="numberOfEmployees"
          withAsterisk
          type="number"
          {...register(`businessSizeAndOwnership.numberOfEmployees`)}
        />
        {/* <Select
          label="Ownership Type"
          withAsterisk
          id="ownershipType"
          data={['Foreign', 'Malawian', 'Mixed']}
          placeholder="select"
          searchable
          {...register('businessSizeAndOwnership.ownershipType', 'select')}
        /> */}
      </Group>
    </Stack>
  );
};
