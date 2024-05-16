import {
  Flex,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import React from 'react';
import { PassFormDataProps } from './formShell';
import { formOfBusiness, malawianDistricts } from '../../_constants';
import { getNationalityValues } from '../../new/_components/mockup/nationality';
import { IconInfoCircle, IconInfoSmall } from '@tabler/icons-react';

export const BasicInfo: React.FC<PassFormDataProps> = ({ register }) => {
  return (
    <Stack>
      <Group grow>
        <TextInput
          label="Taxpayer Identification Number (TIN)"
          {...register(`basic.tinNumber`)}
          disabled
        />
        <Select
          label="Country of Registration"
          data={getNationalityValues()}
          {...register(`basic.countryOfRegistration`, 'select')}
          disabled
        />
      </Group>
      <Group grow>
        <TextInput
          label={
            <Flex align={`center`}>
              Name of Business/Company<Text c={`red`}>*</Text>
              {register(`basic.countryOfRegistration`, 'select').value ===
              'Malawi' ? (
                <Text title="From MBRS">
                  <IconInfoCircle
                    color="blue"
                    stroke={1.5}
                    style={{ marginLeft: '5px' }}
                  />
                </Text>
              ) : (
                ''
              )}
            </Flex>
          }
          id="name"
          {...register(`basic.name`)}
          disabled
        />
        <Select
          label="Form of Business"
          withAsterisk
          data={formOfBusiness}
          {...register('basic.businessType', 'select')}
        />
      </Group>
      {register(`basic.countryOfRegistration`).value === 'Malawi' && (
        <Group grow>
          <TextInput
            label="Registration Number"
            {...register(`basic.registrationNumber`)}
            disabled
          />
        </Group>
      )}
    </Stack>
  );
};
