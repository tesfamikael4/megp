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
import { RequirementCondition } from '@/models/spd/qualification.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  parentId?: string;
}

export function SpdTechnicalScoringFormDetail({
  mode,
  parentId,
}: FormDetailProps) {
  const spdSchema: ZodType<Partial<any>> = z.object({
    requirement: z.string().min(1, { message: 'This field is required' }),
    point: z.string().min(1, { message: 'This field is required' }),
    formLink: z.string().min(1, { message: 'This field is required' }),
    requirementCondition: z.string(),
    specification: z.string(),
    additionalRequirements: z.string(),
    isRequired: z.boolean(),
    isProfessional: z.boolean(),
    isRangeBasedCriteria: z.boolean(),
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
        parentId: parentId ?? '00000000-0000-0000-0000-000000000000',
        orderNo: 1,
      });
      notify('Success', 'technical scoring created successfully');
    } catch (err) {
      notify('Error', 'Error in creating technical scoring');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString(), spdId: id });
      notify('Success', 'technical scoring updated successfully');
    } catch {
      notify('Error', 'Error in updating technical scoring');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'technical scoring  deleted successfully');
    } catch {
      notify('Error', 'Error in deleting technical scoring');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        requirement: selected?.requirement,
        point: selected?.point,
        formLink: selected?.formLink,
        requirementCondition: selected?.requirementCondition,
        specification: selected?.specification,
        additionalRequirements: selected?.additionalRequirements,
        isRequired: selected?.isRequired,
        isProfessional: selected?.isProfessional,
        isRangeBasedCriteria: selected?.isRangeBasedCriteria,
        validation: selected?.validation,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <div className="flex space-x-4">
        <Checkbox
          label="Cannot be modified by procuring entity"
          labelPosition="right"
          className="w-1/2"
          {...register('isRequired')}
        />
        <Checkbox
          label="Is Rating Based Criteria"
          className="w-1/2"
          {...register('isRangeBasedCriteria')}
        />
      </div>
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
      <TextInput
        label="Point"
        withAsterisk
        type="number"
        error={errors?.point ? errors?.point?.message?.toString() : ''}
        {...register('point')}
      />
      <div className="flex space-x-4">
        <NativeSelect
          placeholder="Requirement condition"
          withAsterisk
          className="w-1/2"
          label="Requirement condition"
          data={Object.values(RequirementCondition)}
          {...register('requirementCondition')}
        />
        <TextInput
          label="Bid Form Link"
          withAsterisk
          className="w-1/2"
          error={errors?.formLink ? errors?.formLink?.message?.toString() : ''}
          {...register('formLink')}
        />
      </div>
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
      <Textarea
        label="Specification"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.specification
            ? errors?.specification?.message?.toString()
            : ''
        }
        {...register('specification')}
      />

      <Textarea
        label="Additional requirements"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.additionalRequirements
            ? errors?.additionalRequirements?.message?.toString()
            : ''
        }
        {...register('additionalRequirements')}
      />
      <Checkbox
        label="Is Professional"
        className="w-1/2"
        {...register('isProfessional')}
      />
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
