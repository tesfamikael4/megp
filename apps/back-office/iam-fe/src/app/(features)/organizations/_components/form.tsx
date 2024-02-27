import { Group, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useReadQuery, useInviteOaMutation } from '../_api/custom.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User } from '@/models/user/user';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';

interface FormDetailProps {
  mode: 'new' | 'detail';
  handleCloseModal?: () => void;
}

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
};

const userSchema: ZodType<Partial<User>> = z.object({
  firstName: z.string().min(1, { message: 'First Name is required' }),

  lastName: z.string().min(1, { message: 'Last Name is required' }),
  email: z.union([
    z.literal(''),
    z.string().email({ message: 'Email must be a valid email.' }),
  ]),
});

export function FormDetail({ mode, handleCloseModal }: FormDetailProps) {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useInviteOaMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const onCreate = async (data) => {
    try {
      const result: any = await create({
        ...data,
        email: data.email === '' ? null : data.email,
        fullName: `${data.firstName} ${data.lastName}`,
        organizationId: id?.toString(),
      }).unwrap();

      notify('Success', 'User created successfully');
      result?.error?.data?.message === 'account_exists' &&
        notify('Error', 'Account already exist');
      handleCloseModal ? handleCloseModal() : null;
    } catch (err) {
      logger.log(err);
      notify('Error', 'Error in creating user');
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
        withAsterisk
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
      <Group justify="end">
        <EntityButton
          mode={mode}
          onCreate={handleSubmit(onCreate)}
          onReset={onReset}
          isSaving={isSaving}
        />
      </Group>
    </Stack>
  );
}
