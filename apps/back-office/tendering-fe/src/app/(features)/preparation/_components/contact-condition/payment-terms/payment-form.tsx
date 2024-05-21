import { PaymentTermsForm } from '@/models/contract-condition/contract-payment-terms-forms.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  Flex,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import { notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '../../../_api/scc/payment-terms';

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
  const { id } = useParams();
  const [isPaymentLimitError, setIsPaymentLimitError] =
    useState<boolean>(false);
  const PaymentTermsform: ZodType<Partial<PaymentTermsForm>> = z.object({
    contractCurrency: z.array(
      z.string({ required_error: 'Contract currency is required' }),
    ),
    paymentMode: z
      .array(z.enum(['paymentMethodOne', 'paymentMethodTwo']))
      .min(1, { message: 'Payment Mode is required' }),
    advancePaymentAllowed: z.boolean(),
    advancePaymentLimit: z.number().nonnegative().optional(),
    paymentReleasePeriod: z
      .number()
      .nonnegative()
      .min(1, { message: 'Payment Release Period is required' }),
    latePaymentPenalty: z
      .number()
      .nonnegative()
      .lte(100)
      .min(1, { message: 'Late Payment Penality is required' }),
  });

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    register,
    reset,
  } = useForm({
    resolver: zodResolver(PaymentTermsform),
  });

  const isAdvanceAllowed: boolean = watch('advancePaymentAllowed');
  const paymentLimit = watch('advancePaymentLimit');

  const onCreate = async (data) => {
    if (isAdvanceAllowed) {
      if (!paymentLimit || paymentLimit > 30) {
        setIsPaymentLimitError(true);
        return;
      }
    } else {
      setIsPaymentLimitError(false);
      await create({
        ...data,
        tenderId: id,
        advancePaymentLimit: isAdvanceAllowed ? data.advancePaymentLimit : 0,
      })
        .unwrap()
        .then(() => {
          notify('Success', 'Contract general provision created successfully');
        })
        .catch(() => {
          notify('Error', 'Error in creating contract general provision');
        });
    }
  };

  const onUpdate = async (data) => {
    if (isAdvanceAllowed) {
      if (!paymentLimit || paymentLimit > 30) {
        setIsPaymentLimitError(true);
        return;
      }
    } else {
      setIsPaymentLimitError(false);
      await update({
        ...data,
        tenderId: id,
        advancePaymentLimit: isAdvanceAllowed ? data.advancePaymentLimit : 0,
        id: selected?.id.toString(),
      })
        .unwrap()
        .then(() => {
          notify('Success', 'Contract general provision updated successfully');
        })
        .catch(() => {
          notify('Error', 'Error in updating contract general provision');
        });
    }
  };

  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        contractCurrency: selected?.contractCurrency,
        paymentMode: selected?.paymentMode,
        advancePaymentAllowed: selected?.advancePaymentAllowed,
        advancePaymentLimit: selected?.advancePaymentAllowed
          ? selected?.advancePaymentLimit
          : 0,
        paymentReleasePeriod: selected?.paymentReleasePeriod,
        latePaymentPenalty: selected?.latePaymentPenalty,
      });
    }
  }, [reset, selected, selectedSuccess]);

  return (
    <Stack>
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
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
        <Controller
          name="paymentMode"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <MultiSelect
              label="Payment Mode"
              name={name}
              value={value}
              onChange={onChange}
              className="w-1/2"
              withAsterisk
              data={[
                { label: 'payment method one', value: 'paymentMethodOne' },
                { label: 'payment method two', value: 'paymentMethodTwo' },
              ]}
              searchable
              clearable
              error={errors.paymentMode?.message as string | undefined}
            />
          )}
        />
      </Flex>
      <Flex gap="md">
        <Checkbox
          label="Advance Payment Allowed"
          className="w-1/2"
          {...register('advancePaymentAllowed')}
        />
        {isAdvanceAllowed && (
          <div className="w-1/2">
            <Controller
              name="advancePaymentLimit"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <NumberInput
                  label="Advance Payment Limit"
                  max={31}
                  name={name}
                  value={!isAdvanceAllowed ? 0 : value}
                  onChange={(d) => onChange(parseInt(d as string))}
                  error={
                    errors['advancePaymentLimit']
                      ? errors['advancePaymentLimit']?.message?.toString()
                      : ''
                  }
                />
              )}
            />
            {isPaymentLimitError && (
              <Text className="text-red-500" size="xs">
                Advance Payment is required
              </Text>
            )}
          </div>
        )}
      </Flex>
      <Flex gap="md">
        <Controller
          name="paymentReleasePeriod"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Payment Release Period"
              name={name}
              rightSection={<Text size="sm"> days </Text>}
              rightSectionWidth={'60px'}
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
          name="latePaymentPenalty"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Late Payment Penality"
              name={name}
              value={value}
              min={0}
              max={100}
              rightSection={<Text size="sm"> % </Text>}
              rightSectionWidth={'30px'}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['latePaymentPenalty']
                  ? errors['latePaymentPenality']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </Flex>
      <EntityButton
        mode={selected ? 'detail' : 'new'}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={reset}
      />
    </Stack>
  );
}
