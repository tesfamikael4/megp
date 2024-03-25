import { liabililitesForm } from '@/models/contract-condition/liability-forms.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, LoadingOverlay, NumberInput, Stack } from '@mantine/core';
import { notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '../../../_api/scc/liabilities';

export default function Liabilities() {
  const { id } = useParams();
  const liabililitesForm: ZodType<Partial<liabililitesForm>> = z.object({
    warrantyPeriod: z.number(),
    postWarrantyServicePeriod: z.number(),
    liquidityDamage: z
      .number()
      .min(1, { message: 'Liquidity Damage is required' }),
    liquidityDamageLimit: z
      .number()
      .min(1, { message: 'Liquidity Damage is required' }),
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
  } = useForm({
    resolver: zodResolver(liabililitesForm),
  });

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
      });
      notify('Success', 'Contract liabilities created successfully');
    } catch (err) {
      notify('Error', 'Error in creating contract liabilities');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: id?.toString(),
      });
      notify('Success', 'Contract liabilities updated successfully');
    } catch {
      notify('Error', 'Error in updating contract liabilities');
    }
  };

  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        warrantyPeriod: selected?.warrantyPeriod,
        postWarrantyServicePeriod: selected?.postWarrantyServicePeriod,
        liquidityDamage: selected?.liquidityDamage,
        liquidityDamageLimit: selected?.liquidityDamageLimit,
      });
    }
  }, [reset, selected, selectedSuccess]);

  return (
    <Stack>
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <Flex gap="md">
        <Controller
          name="warrantyPeriod"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Warranty Period"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['warrantyPeriod']
                  ? errors['warrantyPeriod']?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <Controller
          name="postWarrantyServicePeriod"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Post-Warranty Service Period"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['postWarrantyServicePeriod']
                  ? errors['postWarrantyServicePeriod']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </Flex>
      <Flex gap="md">
        <Controller
          name="liquidityDamage"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Liquidty damage"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['liquidityDamage']
                  ? errors['liquidityDamage']?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <Controller
          name="liquidityDamageLimit"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Liquidty Damage Limit"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['liquidityDamageLimit']
                  ? errors['liquidityDamageLimit']?.message?.toString()
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
