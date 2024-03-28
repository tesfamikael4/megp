import { ParticipationFee } from '@/models/tender/participation-fee.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '@/app/(features)/preparation/_api/tender/participation-fees.api';
import { EntityButton } from '@megp/entity';
import { notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';

export default function ParticipationFee() {
  const { id } = useParams();
  const participationFeeSchema: ZodType<Partial<ParticipationFee>> = z.object({
    amount: z.number().min(1, { message: 'This field is required' }),
    currency: z.string().min(1, { message: 'This field is required' }),
    method: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    register,
  } = useForm({
    resolver: zodResolver(participationFeeSchema),
  });

  const { data: selected, isSuccess, isLoading } = useReadQuery(id?.toString());

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
      });
      notify('Success', 'Bid Award created successfully');
    } catch (err) {
      notify('Error', 'Error in creating bid award');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: id?.toString(),
      });
      notify('Success', 'Bid Award updated successfully');
    } catch {
      notify('Error', 'Error in updating bid award');
    }
  };

  useEffect(() => {
    if (selected && isSuccess) {
      reset({
        amount: selected.amount,
        currency: selected.currency,
        method: selected.method,
      });
    }
  }, [reset, selected, isSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <div className="flex gap-3">
        <Controller
          name="amount"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Amount"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['amount'] ? errors['amount']?.message?.toString() : ''
              }
              withAsterisk
            />
          )}
        />

        <Controller
          name="currency"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              placeholder="Currency"
              withAsterisk
              name={name}
              className="w-1/2"
              value={value}
              onChange={(d) => onChange(d)}
              label="Currency"
              data={['USD', 'GBP', 'EUR']}
              error={
                errors['currency']
                  ? errors['currency']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </div>
      <TextInput
        label="Payment Method"
        withAsterisk
        error={errors?.method ? errors?.method?.message?.toString() : ''}
        {...register('method')}
      />
      <EntityButton
        mode={selected ? 'detail' : 'new'}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={reset}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />
    </Stack>
  );
}
