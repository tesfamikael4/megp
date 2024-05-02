import { LoadingOverlay, Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import {
  useCreateMutation,
  useDeleteMutation,
  useReadQuery,
  useUpdateMutation,
} from '../_api/region.api';
import { Region } from '@/models/region';
import { logger } from '@megp/core-fe';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const measurementSchema: ZodType<Partial<Region>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
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
      const result = await create(data);
      if ('data' in result) {
        router.push(`/region/${result?.data?.id}`);
      }
      notifications.show({
        message: 'Region created successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        color: 'red',
        message: 'errors in creating region.',
        title: 'Error',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() }).unwrap();
      notifications.show({
        message: 'Region updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'errors in updating region.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'Region deleted successfully',
        title: 'Success',
        color: 'green',
      });
      router.push('/region');
    } catch (err) {
      const customMsg = err?.data?.message?.includes(
        'update or delete on table "regions" violates foreign key constraint',
      )
        ? 'Region has associated Districts. Please delete them first.'
        : 'Unexpected response structure from the server';
      logger.log(customMsg);
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
