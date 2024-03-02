import { LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  useCreateSuperUserMutation,
  useUpdateSuperUserMutation,
  useDeleteSuperUserMutation,
  useReadSuperUserQuery,
  useUpdateStatusMutation,
} from '@/store/api/super-user/custom.api';
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
    .nullable()
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
  const { organizationId } = useAuth();

  const [create, { isLoading: isSaving }] = useCreateSuperUserMutation();
  const [update, { isLoading: isUpdating }] = useUpdateSuperUserMutation();
  const [activation, { isLoading: isActivating }] = useUpdateStatusMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteSuperUserMutation();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadSuperUserQuery(id?.toString());

  const onCreate = async (data) => {
    try {
      const result: any = await create({
        ...data,
        email: data.email === '' ? null : data.email,
        fullName: `${data.firstName} ${data.lastName}`,
        organizationId: organizationId,
      }).unwrap();

      router.push(`/super-user/${result.id}`);

      notify('Success', 'User created successfully');
    } catch (err) {
      notify(
        'Error',
        `${err.data?.message === 'Conflict' ? 'Email already exist' : 'Error in creating user'}`,
      );
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        firstName: data.firstName,
        lastName: data.lastName,
        id: selected?.accountId,
      }).unwrap();
      notify('Success', 'User updated successfully');
    } catch {
      notify('Error', 'Error in updating user');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notify('Success', 'User deleted successfully');
      router.push('/super-user');
    } catch {
      notify('Error', 'Error in deleting user');
    }
  };
  const onActivate = async () => {
    const dataSent = {
      id: id?.toString(),
      status: selected?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
    };
    try {
      await activation(dataSent).unwrap();
      notify(
        'Success',
        `User ${
          selected?.status === 'ACTIVE' ? 'Deactivated' : 'Activated'
        } successfully`,
      );
    } catch {
      notify(
        'Error',
        `error in ${
          selected?.status === 'ACTIVE' ? 'Deactivating' : 'Activating'
        }  User`,
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
        withAsterisk
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
        disabled={mode === 'detail' && true}
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
