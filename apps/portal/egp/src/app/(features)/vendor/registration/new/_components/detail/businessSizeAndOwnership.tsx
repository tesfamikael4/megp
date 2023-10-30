import { Fieldset, Flex, TextInput } from '@mantine/core';
import React from 'react';
import { IconCash } from '@tabler/icons-react';
import { Select } from '@mantine/core';
import { PassFormDataProps } from './formShell';

export const BusinessSizeAndOwnership: React.FC<PassFormDataProps> = ({
  register,
}) => {
  return (
    <Flex className="flex-col">
      <Fieldset legend="Registered Capital" id="registeredCapital">
        <TextInput
          label="Amount"
          id="amount"
          type="number"
          {...register('businessSizeAndOwnership.registeredCapital.amount')}
        />
        <Select
          label="Currency"
          leftSection={<IconCash size="1rem" />}
          data={['USD', 'ETB', 'EUR', 'GBP', 'KW']}
          placeholder="select"
          searchable
          className="w-[150px]"
          {...register(
            'businessSizeAndOwnership.registeredCapital.currency',
            'select',
          )}
        />
      </Fieldset>

      <Fieldset legend="Paid Up Capital" id="paidUpCapital">
        <TextInput
          label="Amount"
          id="amount"
          type="number"
          {...register(`businessSizeAndOwnership.paidUpCapital.amount`)}
        />
        <Select
          label="Currency"
          id="currency"
          leftSection={<IconCash size="1rem" />}
          data={['USD', 'ETB', 'EUR', 'GBP', 'KW']}
          placeholder="select"
          searchable
          className="w-[150px]"
          {...register(
            'businessSizeAndOwnership.paidUpCapital.currency',
            'select',
          )}
        />
      </Fieldset>

      <TextInput
        label="Number of Employees"
        id="numberOfEmployees"
        type="number"
        {...register(`businessSizeAndOwnership.numberOfEmployees`)}
      />
      <Select
        label="Ownership Type"
        id="ownershipType"
        data={['Malawian', 'Local', 'Foreign', 'Mixed']}
        placeholder="select"
        searchable
        {...register('businessSizeAndOwnership.ownershipType', 'select')}
      />
    </Flex>
  );
};
