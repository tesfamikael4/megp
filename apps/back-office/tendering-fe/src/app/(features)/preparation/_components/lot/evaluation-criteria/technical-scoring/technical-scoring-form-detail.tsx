import {
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
} from '@/app/(features)/preparation/_api/lot/technical-scoring.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import {
  RequirementCondition,
  TechnicalScoring,
} from '@/models/tender/lot/technical-scoring.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  parentId?: string;
  lotId: string;
}

export function TechnicalScoringFormDetail({
  mode,
  parentId,
  lotId,
}: FormDetailProps) {
  const spdSchema: ZodType<Partial<TechnicalScoring>> = z.object({
    requirement: z.string().min(1, { message: 'This field is required' }),
    formLink: z.string().min(1, { message: 'This field is required' }),
    requirementCondition: z.string(),
    point: z.number({ required_error: 'This field is required' }),
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
        lotId: lotId,
        parentId: parentId ?? '00000000-0000-0000-0000-000000000000',
        isProfessional: false,
        hasProfessional: false,
        isRequired: false,
        validation: { min: 0, max: 100 },
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
          name="point"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Point"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['point'] ? errors['point']?.message?.toString() : ''
              }
              withAsterisk
            />
          )}
        />

        <NativeSelect
          placeholder="Requirement condition"
          withAsterisk
          className="w-1/2"
          label="Requirement condition"
          data={Object.values(RequirementCondition)}
          {...register('requirementCondition')}
        />
      </div>
      <TextInput
        label="Bid Form Link"
        withAsterisk
        error={errors?.formLink ? errors?.formLink?.message?.toString() : ''}
        {...register('formLink')}
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
