import { LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
  useListQuery,
} from '../_api/tags.api';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { Tag } from '@/models/Tag';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const tagSchema: ZodType<Partial<Tag>> = z.object({
    name: z
      .string()
      .min(1, { message: 'This field is required' })
      .refine(
        (value) => {
          const tagsList = list?.items.filter(
            (item) => item?.id !== id?.toString(),
          );
          const isUnique =
            tagsList && tagsList.every((tag) => tag.name !== value);
          return isUnique;
        },
        {
          message: 'Name must be unique among existing tag names',
        },
      )
      .refine((value) => /^[A-Za-z ]+$/.test(value), {
        message: 'Tag name must contain only alphabetic characters',
      }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({ resolver: zodResolver(tagSchema) });
  const router = useRouter();
  const { id } = useParams();
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const { data: list } = useListQuery({});
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
        router.push(`/tag/${result?.data?.id}`);
      }
      notifications.show({
        message: 'tag created successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        message: 'errors in deleting tag.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
      notifications.show({
        message: 'tag updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'errors in updating tag.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'tag deleted successfully',
        title: 'Success',
        color: 'green',
      });
      router.push('/tag');
    } catch (err) {
      notifications.show({
        message: 'errors in deleting tag.',
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
