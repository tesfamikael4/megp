import { ContractPaymentScheduleForm } from '@/models/contract-condition/contract-payment-schedule.mode';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Flex,
  MultiSelect,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const requiredDcoument = [
  {
    id: '2',
    name: 'Documents one',
  },
  {
    id: '3',
    name: 'Documents two',
  },
  {
    id: '4',
    name: 'Documents three',
  },
];

export default function PaymentSchedule() {
  const ContractDatesForm: ZodType<Partial<ContractPaymentScheduleForm>> =
    z.object({
      paymentSchedule: z.string().min(1, { message: 'This field is required' }),
      paymentPercentage: z
        .number()
        .min(1, { message: 'This field is required' }),
      order: z.number().min(1, { message: 'This field is required' }),
      requiredDocuments: z
        .array(z.string({ required_error: 'this field is required' }))
        .min(1, { message: 'This field is required' }),
    });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(ContractDatesForm),
  });
  const onCreate = () => {
    logger.log('create');
  };

  return (
    <Stack>
      <Flex gap="md">
        <TextInput
          placeholder="Payment Schedule"
          withAsterisk
          className="w-1/2"
          label="paymentSchedule"
          error={
            errors?.paymentSchedule
              ? errors?.paymentSchedule?.message?.toString()
              : ''
          }
          {...register('paymentSchedule')}
        />

        <Controller
          name="paymentPercentage"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Payment Percentage"
              max={31}
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['paymentPercentage']
                  ? errors['paymentPercentage']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </Flex>
      <Flex gap="md">
        <Controller
          name="order"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Order"
              max={31}
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['order'] ? errors['order']?.message?.toString() : ''
              }
            />
          )}
        />
      </Flex>
      <Flex gap="md">
        <Controller
          name="requiredDocuments"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <MultiSelect
              label="Required Documents"
              name={name}
              value={value}
              onChange={onChange}
              className="w-1/2"
              withAsterisk
              data={requiredDcoument?.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              searchable
              clearable
              error={errors.requiredDocuments?.message as string | undefined}
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
