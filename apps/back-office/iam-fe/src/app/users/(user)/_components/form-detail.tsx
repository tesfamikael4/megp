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
} from '../../_api/user.api';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User } from '@/models/user/user';
import { notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
};

const userSchema: ZodType<Partial<User>> = z.object({
  firstName: z.string().min(1, { message: 'First Name is required' }),

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
  const { user } = useAuth();

  const [create, { isLoading: isSaving, isSuccess: saved }] =
    useCreateMutation();
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
      const result: any = await create({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
        organizationId: user?.organization?.id,
      });
      if ('data' in result) {
        router.push(`/users/${result.data.id}`);
      }
      saved && notify('Success', 'User created successfully');
      result?.error?.data?.message === 'account_exists' &&
        notify('Error', 'Account already exist');
    } catch (err) {
      notify('Error', 'Error in creating user');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
        fullName: `${data.firstName} ${data.lastName}`,
        organizationId: user?.organization?.id,
      });
      notify('Success', 'User updated successfully');
    } catch {
      notify('Error', 'Error in updating user');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'User deleted successfully');
      router.push('/users');
    } catch {
      notify('Error', 'Error in deleting user');
    }
  };
  const onActivate = async () => {
    const dataSent = {
      ...selected,
      isActive: !selected?.isActive,
    };
    try {
      await activation({ ...dataSent, id: id?.toString() });
      notify(
        'Success',
        `User ${selected?.isActive ? 'Deactivated' : 'Activated'} successfully`,
      );
    } catch {
      notify(
        'Error',
        `error in ${selected?.isActive ? 'Deactivating' : 'Activating'}  User`,
      );
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
        entity="user"
      />
    </Stack>
  );
}
