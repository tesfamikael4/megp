import { Button, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useReadQuery, useInviteOaMutation } from '../_api/adress.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User } from '@/models/user/user';
import { notify } from '@megp/core-fe';
import { IconBackspace, IconDeviceFloppy } from '@tabler/icons-react';

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
  email: z
    .string()
    .email({ message: 'Must be a valid email' })
    .optional()
    .or(z.literal('')),
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

  const [create, { isLoading: isSaving, isSuccess: saved }] =
    useInviteOaMutation();

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
        organizationId: id?.toString(),
      });

      saved && notify('Success', 'User created successfully');
      result?.error?.data?.message === 'account_exists' &&
        notify('Error', 'Account already exist');
    } catch (err) {
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

      <Button
        leftSection={<IconDeviceFloppy size={14} stroke={1.6} />}
        loading={isSaving}
        onClick={() => {
          handleSubmit(onCreate);
          handleCloseModal ? handleCloseModal() : null;
        }}
      >
        Save
      </Button>

      <Button
        leftSection={<IconBackspace size={14} stroke={1.6} />}
        onClick={onReset}
        variant="default"
      >
        Reset
      </Button>
    </Stack>
  );
}
