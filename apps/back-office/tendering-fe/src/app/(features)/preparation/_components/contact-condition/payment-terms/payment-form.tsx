import { PaymentTermsForm } from '@/models/contract-condition/contract-payment-terms-forms.model';
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

const currencyList = [
  {
    id: '2',
    name: 'USD',
  },
  {
    id: '3',
    name: 'Euro',
  },
  {
    id: '4',
    name: 'Pound',
  },
  {
    id: '5',
    name: 'Birr',
  },
];

export default function PaymentForm() {
  const PaymentTermsform: ZodType<Partial<PaymentTermsForm>> = z
    .object({
      contractCurrency: z.array(
        z.string({ required_error: 'Contract currency is required' }),
      ),
      paymentMode: z.enum(['payment method one', 'payment method two']),
      advancePaymentAllowed: z.boolean(),
      advancePaymentLimit: z.number().min(30, {
        message: 'advance Payment should be less than or equal to 30 percent',
      }),
      paymentReleasePeriod: z
        .number()
        .min(1, { message: 'Payment Release Period is required' }),
      latePaymentPenality: z
        .number()
        .min(1, { message: 'Late Payment Penality is required' }),
    })
    .refine((data) => data.advancePaymentAllowed, {
      message: 'Advance Payment Limit is required',
      path: ['advancePaymentLimit'],
    });

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(PaymentTermsform),
  });

  const onCreate = () => {
    logger.log('here');
  };
  return (
    <Stack>
      <Flex gap="md">
        <Controller
          name="contractCurrency"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <MultiSelect
              label="Contract Currency"
              name={name}
              value={value}
              onChange={onChange}
              className="w-1/2"
              withAsterisk
              data={currencyList?.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              searchable
              clearable
              error={errors.contractCurrency?.message as string | undefined}
            />
          )}
        />
        <NativeSelect
          placeholder="Payment Mode"
          withAsterisk
          label="Payment Mode"
          className="w-1/2"
          data={['FromTheTotalContractAmount', 'FromRemainingAmount']}
          error={
            errors['paymentMode']
              ? errors['paymentMode']?.message?.toString()
              : ''
          }
          {...register('paymentMode')}
        />
      </Flex>
      <Flex gap="md">
        <Checkbox
          label="Advance Payment Allowed"
          className="w-1/2"
          {...register('advancePaymentAllowed')}
        />
        <Controller
          name="advancePaymentLimit"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Advance Payment Limit"
              max={31}
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['advancePaymentLimit']
                  ? errors['advancePaymentLimit']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </Flex>
      <Flex gap="md">
        <Controller
          name="paymentReleasePeriod"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Payment Release Period"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['paymentReleasePeriod']
                  ? errors['paymentReleasePeriod']?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <Controller
          name="latePaymentPenality"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Late Payment Penality"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['latePaymentPenality']
                  ? errors['latePaymentPenality']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </Flex>
      <EntityButton mode={'new'} onCreate={handleSubmit(onCreate)} />
    </Stack>
  );
}
