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
} from '../_api/donor.api';
import { useParams, useRouter } from 'next/navigation';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntityButton } from '@megp/entity';
import { notifications } from '@mantine/notifications';
import { Donor } from '@/models/donor';

interface FormDetailPropType {
  mode: 'new' | 'detail';
}
const defaultValues = {
  name: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailPropType) {
  const donorSchema: ZodType<Partial<Donor>> = z.object({
    name: z
      .string()
      .min(1, { message: 'This field is required' })
      .refine(
        (value) => {
          const donorsList = list?.items.filter(
            (item) => item?.id !== id?.toString(),
          );
          const isUnique =
            donorsList && donorsList.every((donor) => donor.name !== value);
          return isUnique;
        },
        {
          message: 'Name must be unique among existing donor names',
        },
      ),
    description: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(donorSchema),
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
        router.push(`/lookup/donors/${result?.data?.id}`);
        notify('Success', 'Donor created successfully.');
      }
    } catch (err) {
      let errorMessage = 'Error occurred while creating donor';
      // Handle other specific error messages
      if (err?.data?.message) {
        errorMessage = err.data.message;
      }
      notifications.show({
        message: errorMessage,
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() }).unwrap();
      notify('Success', 'Donor  updated successfully');
    } catch {
      notify('Error', 'Errors in updating donor.');
    }
  };

  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'Donor deleted successfully');
      router.push('/lookup/donors');
    } catch (err) {
      notify('Error', 'Errors in deleting donor.');
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
      />
      <Textarea
        label="Description"
        autosize
        withAsterisk
        minRows={2}
        {...register('description')}
        error={errors?.name ? errors?.description?.message?.toString() : ''}
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
        entity="donors"
      />
    </Stack>
  );
}
