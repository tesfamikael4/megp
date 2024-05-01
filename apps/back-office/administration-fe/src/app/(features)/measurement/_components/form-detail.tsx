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
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const measurementSchema: ZodType<Partial<Measurement>> = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional(),
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
    try {
      const result = await create(data).unwrap();

      // Assuming 'result' contains an 'id' field when creation is successful
      if (result && 'id' in result) {
        router.push(`/measurement/${result.id}`);
        notifications.show({
          message: 'Measurement Created Successfully',
          title: 'Success',
          color: 'green',
        });
      } else {
        // Handle any custom error messages from the backend
        const errorMessage =
          result.message || 'Unexpected response structure from the server';
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Extract error message from the caught error
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Unknown error occurred';
      notifications.show({
        message: errorMessage,
        title: 'Error',
        color: 'red',
      });
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
        message: 'Error In Updating Measurement.',
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
      const customMsg = err?.data?.message?.includes(
        'update or delete on table "measurements" violates foreign key constraint',
      )
        ? 'Measurement has associated Unit Of Measurements. Please delete them first.'
        : 'Unexpected response structure from the server';

      notifications.show({
        message: customMsg,
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
        label="Description"
        {...register('description')}
        error={
          errors?.description ? errors?.description?.message?.toString() : ''
        }
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
