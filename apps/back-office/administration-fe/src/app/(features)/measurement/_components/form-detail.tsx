import { LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '../_api/measurement.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { Measurement } from '@/models/measurement';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  shortName: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const measurementSchema: ZodType<Partial<Measurement>> = z.object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .transform((str) => str.toLowerCase()),
    shortName: z
      .string()
      .optional()
      .transform((str) => (str ? str.toLowerCase() : '')),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },

    register,
  } = useForm({
    resolver: zodResolver(measurementSchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const onCreate = async (data) => {
    const transformedData = {
      ...data,
      name: data.name.toLowerCase(),
      shortName: data.shortName?.toLowerCase(),
    };
    try {
      const result = await create(transformedData).unwrap();
      if ('data' in result) {
        router.push(`/measurement/${result?.data?.id}`);
      }
      notifications.show({
        message: 'Measurement Created Successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (error) {
      if (
        error.data?.statusCode === 400 &&
        error.data?.message.includes('UQ_ecda7925be57c32d6f988ac50b6')
      ) {
        // Display a user-friendly error notification
        notifications.show({
          message: 'A measurement with this name already exists.',
          title: 'Error',
          color: 'red',
        });
      } else {
        notifications.show({
          message: 'Errors in Creating Measurement.',
          title: 'Error',
          color: 'red',
        });
      }
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
      notifications.show({
        message: 'Measurement Updated Successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'Error in Updating Measurement.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'Measurement Deleted Successfully',
        title: 'Success',
        color: 'green',
      });
      router.push('/measurement');
    } catch (err) {
      notifications.show({
        message: 'Error in Deleting Measurement.',
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
        shortName: selected?.shortName,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <TextInput
        withAsterisk
        label="Name"
        {...register('name')}
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        required
      />{' '}
      <TextInput
        // withAsterisk
        label="Abbreviations"
        {...register('shortName')}
        error={errors?.shortName ? errors?.shortName?.message?.toString() : ''}
        // required
      />{' '}
      <EntityButton
        mode={mode}
        // data={selected}
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
