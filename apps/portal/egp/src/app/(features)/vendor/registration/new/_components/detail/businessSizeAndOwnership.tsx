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

export const BusinessSizeAndOwnership: React.FC<PassFormDataProps> = ({
  register,
}) => {
  return (
    <Stack>
      <Group grow>
        <NumberInput
          label="Registered Capital"
          withAsterisk
          rightSectionWidth="80px"
          rightSection={
            <Select
              leftSection={<IconCash size={'1.3rem'} />}
              data={['USD', 'ETB', 'EUR', 'GBP', 'KW']}
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
          }
          {...register(
            'businessSizeAndOwnership.registeredCapital.amount',
            'number',
          )}
          error={
            register('businessSizeAndOwnership.registeredCapital.amount')
              .error ||
            register(
              'businessSizeAndOwnership.registeredCapital.currency',
              'select',
            ).error
          }
          thousandSeparator
          min={1}
          max={100000000000000000}
        />

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
          {...register(
            `businessSizeAndOwnership.paidUpCapital.amount`,
            'number',
          )}
          error={
            register(`businessSizeAndOwnership.paidUpCapital.amount`, 'number')
              .error ||
            register(
              'businessSizeAndOwnership.paidUpCapital.currency',
              'select',
            ).error
          }
          thousandSeparator
          min={1}
          max={
            register('businessSizeAndOwnership.registeredCapital.amount').value
          }
        />
      </Group>
      <Group grow>
        <TextInput
          label="Number of Employees"
          id="numberOfEmployees"
          withAsterisk
          type="number"
          {...register(`businessSizeAndOwnership.numberOfEmployees`)}
        />
        <Select
          label="Ownership Type"
          withAsterisk
          id="ownershipType"
          data={['Malawian', 'Local', 'Foreign', 'Mixed']}
          placeholder="select"
          searchable
          {...register('businessSizeAndOwnership.ownershipType', 'select')}
        />
      </Group>
    </Stack>
  );
};
