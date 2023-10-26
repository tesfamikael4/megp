import { Box, LoadingOverlay, Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';

import { useForm } from 'react-hook-form';
import {
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
  useReadQuery,
} from '../_api/group.api';
import { Group } from '@/models/group';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { relative } from 'path';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  description: '',
};

const groupSchema: ZodType<Partial<Group>> = z.object({
  name: z.string().min(1, { message: 'This field is required' }),
  description: z.string().min(1, { message: 'This field is required' }),
});
export function FormDetail({ mode }: FormDetailProps) {
  const { handleSubmit, reset, register } = useForm({
    resolver: zodResolver(groupSchema),
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
        router.push(`/groups/${result?.data?.id}`);
      }
      notifications.show({
        message: 'Group created successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'Errors in creating Group.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
      notifications.show({
        message: 'Group updated successfully',
        title: 'Success',
      });
    } catch {
      notifications.show({
        message: 'Errors in updating group.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'Group deleted successfully',
        title: 'Success',
      });
      router.push('/groups');
    } catch (err) {
      notifications.show({
        message: 'Errors in deleting group.',
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
      <TextInput withAsterisk label="Name" {...register('name')} />
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
