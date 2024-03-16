import { GuaranteesForm } from '@/models/contract-condition/guararentee-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  Flex,
  MultiSelect,
  NativeSelect,
  NumberInput,
  Stack,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const guarenteeFormData = [
  {
    id: '1',
    name: 'Bank Guarantee',
  },
  {
    id: '2',
    name: 'Insurance Guarantee',
  },
  {
    id: '3',
    name: 'Letter of Credit',
  },
  {
    id: '4',
    name: 'Certified Cheque',
  },
  {
    id: '5',
    name: 'Cash',
  },
];

export default function Guarantees() {
  const guaranteesForm: ZodType<Partial<GuaranteesForm>> = z.object({
    guaranteeType: z.enum([
      'Advance Payment Guarantee',
      'Performance Guarantee',
      'Retention Guarantee',
    ]),
    guaranteeRequired: z.boolean(),
    guaranteePercentage: z
      .number()
      .min(1, { message: 'Guarantee Percentage is required ' }),
    currency: z.enum(['']),
    guaranteeForm: z.enum([
      'Bank Guarantee',
      'Insurance Guarantee',
      'Letter of Credit',
      'Certified Cheque',
      'Cash',
    ]),
    validityPeriod: z
      .number()
      .min(1, { message: 'Validity period is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(guaranteesForm),
  });

  const onCreate = () => {
    logger.log('here');
  };

  return (
    <Stack>
      <Flex gap="md">
        <Checkbox
          label="Guarantee Required"
          className="w-1/2"
          {...register('guaranteeRequired')}
        />
        <NativeSelect
          placeholder="Guarantee Type"
          withAsterisk
          label="Guarantee Type"
          className="w-1/2"
          data={[
            'Advance Payment Guarantee',
            'Performance Guarantee',
            'Retention Guarantee',
          ]}
          error={
            errors['guaranteeType']
              ? errors['guaranteeType']?.message?.toString()
              : ''
          }
          {...register('guaranteeType')}
        />
      </Flex>
      <Flex gap="md">
        <Controller
          name="guaranteePercentage"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Guarantee Percentage"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['guaranteePercentage']
                  ? errors['guaranteePercentage']?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <NativeSelect
          placeholder="Currency"
          withAsterisk
          label="Currency"
          className="w-1/2"
          data={['USD', 'Birr']}
          error={
            errors['currency'] ? errors['currency']?.message?.toString() : ''
          }
          {...register('currency')}
        />
      </Flex>
      <Flex gap="md">
        <Controller
          name="guaranteeForm"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <MultiSelect
              label="Guarantee Form"
              name={name}
              value={value}
              onChange={onChange}
              className="w-1/2"
              withAsterisk
              data={guarenteeFormData?.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              searchable
              clearable
              error={errors.guaranteeForm?.message as string | undefined}
            />
          )}
        />
        <Controller
          name="validityPeriod"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Validity Period"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['validityPeriod']
                  ? errors['validityPeriod']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </Flex>
      <EntityButton
        mode={'new'}
        onCreate={handleSubmit(onCreate)}
        onReset={reset}
      />
    </Stack>
  );
}
