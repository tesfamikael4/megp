import { ProcurementMechanism } from '@/models/tender/evaluation-mechanism';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Stack,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
} from '../../_api/tender/procurement-mechanisms.api';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';

export default function ProcurementMechanismForm() {
  const { id } = useParams();
  const ProcurementMechanismSchema: ZodType<Partial<ProcurementMechanism>> =
    z.object({
      invitationType: z.enum(['direct', 'limited', 'open']),
      stageType: z.enum(['single', 'multiple']),
      marketApproach: z.enum(['local', 'national', 'international']),
      stage: z.number({ required_error: 'Stage is required' }),
    });
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(ProcurementMechanismSchema),
  });
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
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
        invitationType: 'direct',
        stageType: 'single',
        marketApproach: 'local',
        stage: 0,
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
        <NativeSelect
          placeholder="Stage Type"
          withAsterisk
          label="Stage Type"
          className="w-1/2"
          data={['single', 'multiple']}
          error={
            errors?.stageType ? errors?.stageType?.message?.toString() : ''
          }
          {...register('stageType')}
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
        <Controller
          name="stage"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Stage"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['stage'] ? errors['stage']?.message?.toString() : ''
              }
              withAsterisk
            />
          )}
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
