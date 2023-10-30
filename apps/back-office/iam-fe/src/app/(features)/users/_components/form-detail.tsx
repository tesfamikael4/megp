import { LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '../_api/user.api';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { User } from '@/models/user/user';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  firstName: '',
  username: '',
  lastName: '',
  email: '',
};

const userSchema: ZodType<Partial<User>> = z.object({
  firstName: z.string().min(1, { message: 'First Name is required' }),
  username: z.string().min(1, { message: 'User Name is required' }),
  lastName: z.string().min(1, { message: 'Last Name is required' }),
  email: z
    .string()
    .email({ message: 'Must be a valid email' })
    .optional()
    .or(z.literal('')),
});

export function FormDetail({ mode }: FormDetailProps) {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(userSchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [activation, { isLoading: isActivating }] = useUpdateMutation();
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
        fullName: `${data.firstName} ${data.lastName}`,
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
        superTokenUserId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      });
      if ('data' in result) {
        router.push(`/users/${result.data.id}`);
      }
      notifications.show({
        message: 'user created successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        message: 'error in creating user',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
        fullName: `${data.firstName} ${data.lastName}`,
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
        superTokenUserId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      });
      notifications.show({
        message: 'user updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'error in updating user',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notifications.show({
        message: 'user  deleted successfully',
        title: 'Success',
        color: 'green',
      });
      router.push('/users');
    } catch {
      notifications.show({
        message: 'error in deleting user',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onActivate = async () => {
    const dataSent = {
      ...selected,
      isActive: !selected?.isActive,
    };
    try {
      await activation({ ...dataSent, id: id?.toString() });
      notifications.show({
        message: `User ${
          selected?.isActive ? 'Deactivated' : 'Activated'
        } successfully`,
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: `error in ${
          selected?.isActive ? 'Deactivating' : 'Activating'
        }  User`,
        title: 'Success',
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
        firstName: selected?.firstName,
        lastName: selected?.lastName,
        username: selected?.username,
        email: selected?.email,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <TextInput
        label="First Name"
        error={errors?.firstName ? errors?.firstName?.message?.toString() : ''}
        {...register('firstName')}
      />

      <TextInput
        withAsterisk
        label="Last Name"
        error={errors?.lastName ? errors?.lastName?.message?.toString() : ''}
        {...register('lastName')}
      />

      <TextInput
        label="User Name"
        withAsterisk
        error={errors?.userName ? errors?.userName?.message?.toString() : ''}
        {...register('username')}
      />
      <TextInput
        label="Email"
        error={errors?.email ? errors?.email?.message?.toString() : ''}
        {...register('email')}
      />

      <EntityButton
        mode={mode}
        data={selected}
        onActivate={handleSubmit(onActivate)}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        isActivating={isActivating}
      />
    </Stack>
  );
}
