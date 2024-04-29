import {
  LoadingOverlay,
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
} from '../_api/preference-margin.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { SpdPreferenceMargin } from '@/models/spd/preference-margin.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  pmId: string;
  returnFunction: () => void;
}

export function SpdPreferenceMarginFormDetail({
  mode,
  pmId,
  returnFunction,
}: FormDetailProps) {
  const spdSchema: ZodType<Partial<SpdPreferenceMargin>> = z.object({
    condition: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
    itbReference: z.string().min(1, { message: 'This field is required' }),
    itbDescription: z.string().min(1, { message: 'This field is required' }),
    margin: z.number(),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
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
  } = useReadQuery(pmId?.toString());

  const onCreate = async (data) => {
    logger.log('here');
    try {
      await create({ ...data, spdId: id, preferenceType: '' });
      returnFunction();
      notify('Success', 'Preference Margin created successfully');
    } catch (err) {
      notify('Error', 'Error in creating preference margin');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString(), spdId: id });
      returnFunction();
      notify('Success', 'Preference Margin updated successfully');
    } catch {
      notify('Error', 'Error in updating preference margin');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      returnFunction();
      notify('Success', 'Preference Margin  deleted successfully');
    } catch {
      notify('Error', 'Error in deleting preference margin');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        condition: selected?.condition,
        description: selected?.description,
        itbReference: selected?.itbReference,
        itbDescription: selected?.itbDescription,
        margin: Number(selected?.margin),
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Textarea
        label="Condition"
        withAsterisk
        autosize
        minRows={2}
        error={errors?.condition ? errors?.condition?.message?.toString() : ''}
        {...register('condition')}
      />
      <Textarea
        label="Description"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.description ? errors?.description?.message?.toString() : ''
        }
        {...register('description')}
      />
      <TextInput
        label="Itb Reference"
        withAsterisk
        error={
          errors?.itbReference ? errors?.itbReference?.message?.toString() : ''
        }
        {...register('itbReference')}
      />
      <Textarea
        label="Itb Description"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.itbDescription
            ? errors?.itbDescription?.message?.toString()
            : ''
        }
        {...register('itbDescription')}
      />
      <Controller
        name="margin"
        control={control}
        render={({ field: { name, value, onChange } }) => (
          <NumberInput
            label="Margin"
            name={name}
            value={value}
            className="w-1/2"
            onChange={(d) => onChange(parseInt(d as string))}
            error={
              errors['margin'] ? errors['margin']?.message?.toString() : ''
            }
            withAsterisk
          />
        )}
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
