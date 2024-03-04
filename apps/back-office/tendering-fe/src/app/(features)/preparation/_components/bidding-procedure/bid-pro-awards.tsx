import { ITenderAward } from '@/models/tender/bid-procedures/award.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, LoadingOverlay, NumberInput, Stack } from '@mantine/core';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '@/app/(features)/preparation/_api/tender/bid-award.api';
import { EntityButton } from '@megp/entity';
import { notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';

export default function BidProAwards() {
  const { id } = useParams();
  const bidProAwardsSchema: ZodType<Partial<ITenderAward>> = z.object({
    percentageQuantityIncreased: z
      .number()
      .min(1, { message: 'This field is required' }),
    percentageQuantityDecreased: z
      .number()
      .min(1, { message: 'This field is required' }),
    negotiationAllowed: z.boolean(),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    register,
  } = useForm({
    resolver: zodResolver(bidProAwardsSchema),
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
        percentageQuantityIncreased: selected.percentageQuantityIncreased,
        percentageQuantityDecreased: selected.percentageQuantityDecreased,
        negotiationAllowed: selected.negotiationAllowed,
      });
    }
  }, [reset, selected, isSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <div className="flex gap-3">
        <Controller
          name="percentageQuantityIncreased"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Percentage Quantity Increase"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['percentageQuantityIncreased']
                  ? errors['percentageQuantityIncreased']?.message?.toString()
                  : ''
              }
              withAsterisk
            />
          )}
        />

        <Controller
          name="percentageQuantityDecreased"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Percentage Quantity Decreased"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['percentageQuantityDecreased']
                  ? errors['percentageQuantityDecreased']?.message?.toString()
                  : ''
              }
              withAsterisk
            />
          )}
        />
      </div>
      <Checkbox
        label="Negotiation Allowed"
        className="w-1/2"
        {...register('negotiationAllowed')}
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
