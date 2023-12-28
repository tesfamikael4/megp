import { LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { Currency } from '@/models/currency';
import {
  useCreateMutation,
  useDeleteMutation,
  useReadQuery,
  useUpdateMutation,
} from '../_api/currency.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  description: '',
  abbreviation: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const currencySchema: ZodType<Partial<Currency>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().optional(),
    abbreviation: z.string().min(1),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },

    register,
  } = useForm({
    resolver: zodResolver(currencySchema),
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
        router.push(`/currency/${result?.data?.id}`);
      }
      notifications.show({
        message: 'Currency created successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        message: 'Error in deleting Currency.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
      notifications.show({
        message: 'Currency Updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'Error in Updating Currency.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'currency Deleted successfully',
        title: 'Success',
        color: 'green',
      });
      router.push('/currency');
    } catch (err) {
      notifications.show({
        message: 'Error in Deleting currency.',
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
        abbreviation: selected?.abbreviation,
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
      <TextInput
        // withAsterisk
        label="Abbreviation"
        {...register('abbreviation')}
        error={
          errors?.abbreviation ? errors?.abbreviation?.message?.toString() : ''
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
