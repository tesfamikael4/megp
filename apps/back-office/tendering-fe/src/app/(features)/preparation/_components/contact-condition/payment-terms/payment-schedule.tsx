import { ContractPaymentScheduleForm } from '@/models/contract-condition/contract-payment-schedule.mode';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Flex,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { notify, logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '../../../_api/scc/payment-schedules';
import { useParams } from 'next/navigation';

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
  const { id } = useParams();
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
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(ContractDatesForm),
  });

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
      });
      notify('Success', 'Payment schedule created successfully');
    } catch (err) {
      notify('Error', 'Error in creating payment schedule');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: selected?.id.toString(),
      });
      notify('Success', 'Payment schedule updated successfully');
    } catch {
      notify('Error', 'Error in updating payment schedule');
    }
  };

  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        paymentSchedule: selected?.paymentSchedule,
        paymentPercentage: selected?.paymentPercentage,
        order: selected?.order,
        requiredDocuments: selected?.requiredDocuments,
      });
    }
  }, [reset, selected, selectedSuccess]);

  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  return (
    <Stack>
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
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
        mode={selected ? 'detail' : 'new'}
        onCreate={handleSubmit(onCreate)}
        onReset={reset}
        onUpdate={handleSubmit(onUpdate)}
      />
    </Stack>
  );
}
