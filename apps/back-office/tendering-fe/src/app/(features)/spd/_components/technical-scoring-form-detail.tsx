import {
  Checkbox,
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '../_api/technical-scoring.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { TechnicalScoring } from '@/models/tender/lot/technical-scoring.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  parentId?: string;
  returnFunction: () => void;
}

export function SpdTechnicalScoringFormDetail({
  mode,
  parentId,
  returnFunction,
}: Readonly<FormDetailProps>) {
  const spdSchema: ZodType<Partial<TechnicalScoring>> = z.object({
    requirement: z.string().min(1, { message: 'This field is required' }),
    formLink: z.string().min(1, { message: 'This field is required' }),
    isProfessional: z.boolean(),
    validation: z.object({
      min: z
        .number()
        .min(0, { message: 'minimum number 0' })
        .max(100, { message: 'maximum number 100' }),
      max: z
        .number()
        .min(0, { message: 'minimum number 0' })
        .max(100, { message: 'maximum number 100' }),
    }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(spdSchema),
  });
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  useEffect(() => {
    logger.log(errors);
  }, [errors]);

  const onCreate = async (data) => {
    logger.log('here');
    try {
      await create({
        ...data,
        spdId: id,
        parentId: parentId ?? null,
        orderNo: 1,
      });
      notify('Success', 'technical scoring created successfully');
      returnFunction();
    } catch (err) {
      notify('Error', 'Error in creating technical scoring');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString(), spdId: id });
      notify('Success', 'technical scoring updated successfully');
      returnFunction();
    } catch {
      notify('Error', 'Error in updating technical scoring');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'technical scoring  deleted successfully');
      returnFunction();
    } catch {
      notify('Error', 'Error in deleting technical scoring');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        requirement: selected?.requirement,
        formLink: selected?.formLink,
        isProfessional: selected?.isProfessional,
        validation: selected?.validation,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <Textarea
        label="Criteria"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.requirement ? errors?.requirement?.message?.toString() : ''
        }
        {...register('requirement')}
      />

      <div className="flex space-x-4">
        <Controller
          name="validation.min"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Minimum Allocated Mark"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['validation']
                  ? errors['validation']['min']?.message?.toString()
                  : ''
              }
              withAsterisk
            />
          )}
        />

        <Controller
          name="validation.max"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Maximum Allocated Mark"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['validation']
                  ? errors['validation']['max']?.message?.toString()
                  : ''
              }
              withAsterisk
            />
          )}
        />
      </div>
      <div className="flex space-x-4">
        <TextInput
          label="Bid Form Link"
          withAsterisk
          className="w-1/2"
          error={errors?.formLink ? errors?.formLink?.message?.toString() : ''}
          {...register('formLink')}
        />
        <Checkbox
          label="Is Professional"
          className="w-1/2 my-auto"
          {...register('isProfessional')}
        />
      </div>
      <EntityButton
        mode={mode}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </Stack>
  );
}
