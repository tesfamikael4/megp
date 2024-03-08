import { LoadingOverlay, Stack, TextInput, Textarea } from '@mantine/core';
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
import { useEffect } from 'react';
import { notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';
import { useListByIdQuery } from '../_api/group.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const groupSchema: ZodType<Partial<Group>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(groupSchema),
  });

  const router = useRouter();
  const { id } = useParams();
  const { organizationId } = useAuth();

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
      const result = await create({
        ...data,
        organizationId: organizationId,
      }).unwrap();

      if ('data' in result) {
        router.push(`/groups/${result?.data?.id}`);
      }
      notify('Success', 'Group created successfully');
    } catch (err) {
      notify(
        'Error',
        `${err.data.message.toLowerCase().startsWith('duplicate') ? 'Group already exist' : 'Errors in creating Group.'}`,
      );
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
        organizationId: organizationId,
      }).unwrap();
      notify('Success', 'Group updated successfully');
    } catch (err) {
      notify(
        'Error',
        `${err.data.message.toLowerCase().startsWith('duplicate') ? 'Group already exist' : 'Errors in creating Group.'}`,
      );
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notify('Success', 'Group deleted successfully');

      router.push('/groups');
    } catch (err) {
      notify(
        'Error',
        `${err.data.message === 'cant_delete_user_group_with_users' ? 'This group contains assigned user and cannot be deleted. ' : 'Errors in deleting group.'}`,
      );
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
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        withAsterisk
        label="Name"
        {...register('name')}
      />
      <Textarea
        label="Description"
        withAsterisk
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
        entity="group"
      />
    </Stack>
  );
}
