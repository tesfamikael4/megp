import { Flex, Select, TextInput } from '@mantine/core';
import React from 'react';
import { PassFormDataProps } from './formShell';

export const BasicInfo: React.FC<PassFormDataProps> = ({ register }) => {
  return (
    <Flex className="flex-wrap">
      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Name of Business/Company"
          id="name"
          {...register(`basic.name`)}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <Select
          className="w-full"
          label="Form of Business"
          searchable
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
          {...register('basic.businessType', 'select')}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Business/Company Origin"
          id="origin"
          {...register(`basic.origin`)}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="District"
          id="district"
          {...register(`basic.district`)}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Country"
          id="country"
          {...register(`basic.country`)}
        />
      </Flex>

      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <TextInput
          className="w-full"
          label="Tin Number"
          id="tinNumber"
          {...register(`basic.tinNumber`)}
        />
      </Flex>
      <Flex justify={'end'} p={20} gap={20}></Flex>
    </Flex>
  );
};
