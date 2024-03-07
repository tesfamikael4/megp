import { Group, Stack, TextInput } from '@mantine/core';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useInviteOaMutation } from '../_api/custom.api';

import { useParams } from 'next/navigation';
import { User } from '@/models/user/user';
import { notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';

interface FormDetailProps {
  mode: 'new';
  handleCloseModal?: () => void;
}

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
};

const userSchema: ZodType<Partial<User>> = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First Name is required' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Only texts are allowed' }),

  lastName: z
    .string()
    .min(1, { message: 'Last Name is required' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Only texts are allowed' }),
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

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        email: data.email === '' ? null : data.email,
        fullName: `${data.firstName} ${data.lastName}`,
        organizationId: id?.toString(),
      }).unwrap();

      notify('Success', 'User created successfully');

      handleCloseModal ? handleCloseModal() : null;
    } catch (err) {
      notify(
        'Error',
        `${err.data.message === 'Conflict' ? 'Email already exist' : 'Error in creating user'}`,
      );
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  return (
    <Stack pos="relative">
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
