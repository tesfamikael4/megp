'use client';
import { notify } from '@megp/core-fe';
import React, { useEffect } from 'react';
import { Stack, TextInput } from '@mantine/core';
import {
  useDeleteMutation,
  useCreateMutation,
  useUpdateMutation,
  useReadQuery,
  useListQuery,
} from '../_api/tax.api';
import { useParams, useRouter } from 'next/navigation';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntityButton } from '@megp/entity';
import { notifications } from '@mantine/notifications';
import { Tax } from '@/models/tax';

interface FormDetailPropType {
  mode: 'new' | 'detail';
}
const defaultValues = {
  name: '',
  shortName: '',
  percentage: null,
};

export function FormDetail({ mode }: FormDetailPropType) {
  const taxSchema: ZodType<Partial<Tax>> = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'This field is required' })
      .refine(
        (value) => {
          const taxList = list?.items.filter(
            (item) => item?.id !== id?.toString(),
          );
          const isUnique =
            taxList && taxList.every((tax) => tax.name !== value);
          return isUnique;
        },
        {
          message: 'Name must be unique among existing tax names',
        },
      ),
    shortName: z.string().min(1, { message: 'This field is required' }),
    percentage: z.number().min(1, { message: 'This field is required' }).max(100),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(taxSchema),
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
      if (result && 'data' in result) {
        router.push(`/tax/${result?.data?.id}`);
        notify('Success', 'Tax created successfully.');
      }
    } catch (err) {
      const customMsg = err?.data?.message?.includes(
        'duplicate key value violates unique constraint',
      )
        ? 'Tax with this name already exist.'
        : 'Unexpected response structure from the server';

      notifications.show({
        message: customMsg,
        title: 'Error',
        color: 'red',
      });
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() }).unwrap();
      notify('Success', 'Tax updated successfully');
    } catch {
      notify('Error', 'Errors in updating tax.');
    }
  };

  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'Tax deleted successfully');
      router.push('/tax');
    } catch (err) {
      notify('Error', 'Errors in deleting tax.');
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        shortName: selected?.shortName,
        percentage: selected?.percentage,
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
      />

      <TextInput
        withAsterisk
        label="Short Name"
        {...register('shortName')}
        error={errors?.shortName ? errors?.shortName?.message?.toString() : ''}
      />

      <TextInput
        withAsterisk
        label="Percentage"
        type="number"
        {...register('percentage', { valueAsNumber: true })}
        error={
          errors?.percentage ? errors?.percentage?.message?.toString() : ''
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
        entity="tax"
      />
    </Stack>
  );
}
