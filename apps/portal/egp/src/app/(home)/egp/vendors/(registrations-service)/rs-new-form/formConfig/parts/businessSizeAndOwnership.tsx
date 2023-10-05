import { NumberInput, Stack, Tabs } from '@mantine/core';
import React from 'react';
import { CouplerPanel } from '../../../../_shared/components';
import { IconCash, IconNumber } from '@tabler/icons-react';
import { Select } from '@mantine/core';

interface Props {
  form: any;
}

export const BusinessSizeAndOwnership: React.FC<Props> = ({ form }) => {
  return (
    <Tabs.Panel value="businessSizeAndOwnership">
      <Stack my={15}>
        <CouplerPanel label="Registered Capital" id="registeredCapital">
          <Stack my={15}>
            <NumberInput
              label="Amount"
              id="amount"
              {...form.getInputProps(
                `businessSizeAndOwnership.registeredCapital.amount`,
              )}
            />
          </Stack>

          <Stack my={15}>
            <Select
              label="Currency"
              id="currency"
              icon={<IconCash size="1rem" />}
              data={['USD', 'ETB', 'EUR', 'GBP', 'KW']}
              placeholder="select"
              searchable
              {...form.getInputProps(
                `businessSizeAndOwnership.registeredCapital.currency`,
              )}
              className="w-[150px]"
            />
          </Stack>
        </CouplerPanel>
      </Stack>

      <Stack my={15}>
        <CouplerPanel label="Paid Up Capital" id="paidUpCapital">
          <Stack my={15}>
            <NumberInput
              icon={<IconNumber size={'1rem'} />}
              label="Amount"
              id="amount"
              {...form.getInputProps(
                `businessSizeAndOwnership.paidUpCapital.amount`,
              )}
            />
          </Stack>

          <Stack my={15}>
            <Select
              label="Currency"
              id="currency"
              icon={<IconCash size="1rem" />}
              data={['USD', 'ETB', 'EUR', 'GBP', 'KW']}
              placeholder="select"
              searchable
              {...form.getInputProps(
                `businessSizeAndOwnership.paidUpCapital.currency`,
              )}
              className="w-[150px]"
            />
          </Stack>
        </CouplerPanel>
      </Stack>

      <Stack my={15}>
        <NumberInput
          icon={<IconNumber size={'1rem'} />}
          label="Number of Employees"
          id="numberOfEmployees"
          {...form.getInputProps(`businessSizeAndOwnership.numberOfEmployees`)}
        />
      </Stack>

      <Stack my={15}>
        <Select
          label="Ownership Type"
          id="ownershipType"
          data={['Malawian', 'Local', 'Foreign', 'Mixed']}
          placeholder="select"
          searchable
          {...form.getInputProps(`businessSizeAndOwnership.ownershipType`)}
        />
      </Stack>
    </Tabs.Panel>
  );
};
