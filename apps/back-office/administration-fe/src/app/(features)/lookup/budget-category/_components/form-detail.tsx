'use client';
import { notify } from '@megp/core-fe';
import React, { useEffect } from 'react';
import { Stack, TextInput, Textarea } from '@mantine/core';
import {
  useDeleteMutation,
  useCreateMutation,
  useUpdateMutation,
  useReadQuery,
  useListQuery,
} from '../_api/budget-category.api';
import { useParams, useRouter } from 'next/navigation';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetCategory } from '@/models/budget-category';
import { EntityButton } from '@megp/entity';
import { notifications } from '@mantine/notifications';

interface FormDetailPropType {
  mode: 'new' | 'detail';
}
const defaultValues = {
  name: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailPropType) {
  const budgetCategorySchema: ZodType<Partial<BudgetCategory>> = z.object({
    name: z
      .string()
      .min(1, { message: 'This field is required' })
      .refine(
        (value) => {
          const budgetGategoryList = list?.items.filter(
            (item) => item?.id !== id?.toString(),
          );
          const isUnique =
            budgetGategoryList &&
            budgetGategoryList.every(
              (budgetCategory) => budgetCategory.name !== value,
            );
          return isUnique;
        },
        {
          message: 'Name must be unique among existing budget category names',
        },
      ),
    description: z.string(),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(budgetCategorySchema),
  });
  const router = useRouter();
  const { id } = useParams();
  const { data: list } = useListQuery({});

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );

  const onCreate = async (data) => {
    try {
      const result = await create(data);
      if ('data' in result) {
        router.push(`/lookup/budget-category/${result?.data?.id}`);
      }
      notifications.show({
        message: 'Budget Category created successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        color: 'red',
        message: 'errors in creating Budget Category.',
        title: 'Error',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() }).unwrap();
      notify('Success', 'Budget Category  updated successfully');
    } catch {
      notify('Error', 'Errors in updating Budget Category .');
    }
  };

  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notifications.show({
        message: 'Budget Category deleted successfully',
        title: 'Success',
        color: 'green',
      });
      router.push('/lookup/budget-category');
    } catch (err) {
      notifications.show({
        message: 'errors in deleting Budget Category.',
        title: 'Error',
        color: 'red',
      });
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
