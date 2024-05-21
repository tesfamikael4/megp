import { ProcurementMechanism } from '@/models/tender/evaluation-mechanism';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Flex,
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
} from '../../_api/tender/procurement-mechanisms.api';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';

export default function ProcurementMechanismForm() {
  const { id } = useParams();
  const ProcurementMechanismSchema: ZodType<Partial<ProcurementMechanism>> =
    z.object({
      invitationType: z.enum(['direct', 'limited', 'open']),
      stageType: z.enum(['single', 'multiple']),
      marketApproach: z.enum(['local', 'national', 'international']),
    });
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());
  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(ProcurementMechanismSchema),
  });
  const stageTypeValue = watch('stageType');
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
        stage: stageTypeValue === 'single' ? 1 : 2,
      });
      notify('Success', 'Procurement Mechanism created successfully');
    } catch (err) {
      notify('Error', 'Error in creating procurement mechanism');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: id?.toString(),
        stage: stageTypeValue === 'single' ? 1 : data.stage,
      });
      notify('Success', 'Qualification updated successfully');
    } catch {
      notify('Error', 'Error in updating spd');
    }
  };
  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        invitationType: selected?.invitationType,
        stageType: selected?.stageType,
        marketApproach: selected?.marketApproach,
        stage: selected?.stage,
      });
    } else {
      reset({
        invitationType: '',
        stageType: '',
        marketApproach: '',
        stage: 1,
      });
    }
  }, [reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <div className="w-full flex space-x-4">
        <NativeSelect
          placeholder="Invitation Type"
          withAsterisk
          label="Invitation Type"
          className="w-1/2"
          data={['direct', 'limited', 'open']}
          error={
            errors?.invitationType
              ? errors?.invitationType?.message?.toString()
              : ''
          }
          {...register('invitationType')}
        />
        <Controller
          name="stageType"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NativeSelect
              label="Stage Type"
              placeholder="Stage Type"
              withAsterisk
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(d)}
              data={[
                { value: 'single', label: 'Single Stage' },
                { value: 'multiple', label: 'Multiple Value' },
              ]}
              error={
                errors?.stageType ? errors?.stageType?.message?.toString() : ''
              }
            />
          )}
        />
      </div>
      <div className="w-full flex space-x-4">
        <NativeSelect
          placeholder="Market Approach"
          withAsterisk
          className="w-1/2"
          label="Market Approach"
          data={['local', 'national', 'international']}
          error={
            errors?.marketApproach
              ? errors?.marketApproach?.message?.toString()
              : ''
          }
          {...register('marketApproach')}
        />
      </div>

      <EntityButton
        mode={selected !== undefined ? 'detail' : 'new'}
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
