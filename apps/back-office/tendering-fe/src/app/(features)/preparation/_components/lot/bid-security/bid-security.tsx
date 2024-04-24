import type { BidSecurity } from '@/models/tender/lot/bid-security.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '../../../_api/lot/bid-security.api';
import { logger, notify } from '@megp/core-fe';

interface BidSecurityProps {
  lotId: string;
}

export default function BidSecurity({ lotId }: BidSecurityProps) {
  const BidSeuritySchema: ZodType<Partial<BidSecurity>> = z.object({
    bidSecurityRequired: z.boolean(),
    bidSecurityAmount: z.number({ required_error: 'This field is required' }),
    bidSecurityCurrency: z
      .string()
      .min(1, { message: 'This field is required' }),
    bidSecurityForm: z.enum([
      'declaration',
      'spo',
      'insurance letter',
      'Letter from small and micro enterprise',
    ]),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    register,
  } = useForm({
    resolver: zodResolver(BidSeuritySchema),
  });
  const { data: selected, isSuccess, isLoading } = useReadQuery(lotId);
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        lotId: lotId,
      });
      notify('Success', 'Bid Security created successfully');
    } catch (err) {
      notify('Error', 'Error in creating Bid Security');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        lotId: lotId,
        id: lotId,
      });
      notify('Success', 'Bid Security updated successfully');
    } catch {
      notify('Error', 'Error in updating Bid submission');
    }
  };
  useEffect(() => {
    logger.log(selected);

    if (selected) {
      reset({
        bidSecurityRequired: selected?.bidSecurityRequired,
        bidSecurityAmount: selected?.bidSecurityAmount,
        bidSecurityCurrency: selected?.bidSecurityCurrency,
        bidSecurityForm: selected?.bidSecurityForm,
      });
    }
  }, [isSuccess, selected, reset]);
  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <div className="flex gap-6">
        <Checkbox
          label="Bid Security Required"
          {...register('bidSecurityRequired')}
        />
      </div>
      <div className="flex gap-6">
        <Controller
          name="bidSecurityAmount"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              name={name}
              value={value}
              label="Bid Security Amount"
              withAsterisk
              className="w-1/2"
              onChange={onChange}
              error={
                errors?.bidSecurityAmount
                  ? errors?.bidSecurityAmount?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <TextInput
          label="Bid Security Currency"
          withAsterisk
          className="w-1/2"
          error={
            errors?.bidSecurityCurrency
              ? errors?.bidSecurityCurrency?.message?.toString()
              : ''
          }
          {...register('bidSecurityCurrency')}
        />
      </div>
      <NativeSelect
        placeholder="Bid Security Form"
        withAsterisk
        label="Bid Security Form"
        className="w-1/2"
        data={[
          'declaration',
          'spo',
          'insurance letter',
          'Letter from small and micro enterprise',
        ]}
        error={
          errors['bidSecurityForm']
            ? errors['bidSecurityForm']?.message?.toString()
            : ''
        }
        {...register('bidSecurityForm')}
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
