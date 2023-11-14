'use client';
import { notify } from '@megp/core-fe';
import React, { useEffect } from 'react';
import { Stack, TextInput, Textarea } from '@mantine/core';
import {
  useDeleteMutation,
  useCreateMutation,
  useUpdateMutation,
  useReadQuery,
} from '../_api/budget-category.api';
import { EntityButton } from '@megp/entity';
import { useParams, useRouter } from 'next/navigation';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetCategory } from '@/models/budget-category';

interface FormDetailPropType {
  mode: 'new' | 'detail';
}
const defaultValues = {
  name: '',
  description: '',
};
const procurementMethodSchema: ZodType<Partial<BudgetCategory>> = z.object({
  name: z.string().min(1, { message: 'This field is required' }),
  description: z.string().min(1, { message: 'This field is required' }),
});
export function FormDetail({ mode }: FormDetailPropType) {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(procurementMethodSchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );

  const onCreate = async (data) => {
    try {
      const result = await create({
        ...data,
      });
      if ('data' in result) {
        router.push(`/lookup/budget-category/${result?.data?.id}`);
      }
      notify('Success', 'Budget Catgory created successfully');
    } catch (err) {
      notify('Error', 'Errors in creating Budget Catgory .');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
      });
      notify('Success', 'Budget Catgory  updated successfully');
    } catch {
      notify('Error', 'Errors in updating Budget Catgory .');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notify('Success', 'Budget Catgory  deleted successfully');
      router.push('/lookup/budget-category');
    } catch (err) {
      notify('Error', 'Errors in deleting Budget Catgory .');
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        description: selected?.description,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack>
      <TextInput
        withAsterisk
        label="Name"
        {...register('name')}
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        required
      />
      <Textarea
        label="Description"
        autosize
        minRows={2}
        {...register('description')}
        error={
          errors?.description ? errors?.description?.message?.toString() : ''
        }
      />
      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </Stack>
  );
}
