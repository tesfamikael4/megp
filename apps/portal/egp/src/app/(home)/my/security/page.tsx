'use client';

import {
  Container,
  TextInput,
  Divider,
  Button,
  PasswordInput,
  Text,
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useChangePasswordMutation } from '@/store/api/auth/auth.api';
import ChangeSecurity from './changeSecurity';
import { notifications } from '@mantine/notifications';

const schema = z.object({
  oldPassword: z.string().min(1, { message: 'This field is required.' }),
  newPassword: z
    .string()
    .min(1, { message: 'This field is required.' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-zA-Z]/, {
      message: 'Password must have at least one alphabet character',
    })
    .regex(/[0-9]/, { message: 'Password must have at least one number' }),
});
type FormSchema = z.infer<typeof schema>;

export default function MyProfilePage() {
  const [
    changePassword,
    {
      isLoading: isChangingPassword,
      isSuccess: isChangedPassword,
      isError: isChangePasswordError,
      error: changePasswordError,
    },
  ] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    setErrorMessage('');
    const changePass = await changePassword(data);
    if (changePass && isChangedPassword) {
      notifications.show({
        title: 'Success',
        message: 'Password Changed Successfully',
      });
      reset();
    }
  };

  useEffect(() => {
    if (isChangedPassword) {
      notifications.show({
        title: 'Success',
        message: 'Password Changed Successfully',
      });
      reset();
    }
  }, [isChangedPassword, reset]);

  useEffect(() => {
    if (changePasswordError && 'data' in changePasswordError) {
      const errorData = changePasswordError.data as { message: string };
      setErrorMessage(errorData.message);
    }
  }, [changePasswordError]);

  return (
    <>
      <Container className="mt-5">
        {errorMessage === 'invalid claim' && (
          <div className="bg-red-400 text-white p-4 w-fit">
            This email is not verified. Please sign-up again.
          </div>
        )}
        {errorMessage === 'New password cannot be the same as old one' && (
          <div className="bg-red-400 text-white p-4 w-fit">
            Old Password cannot be the same as new one. Please enter a different
            password and try again.
          </div>
        )}
        {errorMessage === 'INVALID_USERNAME_OR_PASSWORD' && (
          <div className="bg-red-400 text-white p-4 w-fit">
            The password your entered is incorrect. Please try again.
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <Text>Change Password</Text>
          <Divider className="mb-2" />
          <PasswordInput
            label="Old Password"
            withAsterisk
            placeholder="********"
            {...register('oldPassword')}
            error={errors.oldPassword?.message}
          />
          <Divider my={15} />
          <PasswordInput
            label="New Password"
            withAsterisk
            placeholder="********"
            {...register('newPassword')}
            error={errors.newPassword?.message}
          />
          <Divider my={15} />
          <PasswordInput
            label="Confirm Password"
            withAsterisk
            placeholder="********"
            {...register('newPassword')}
          />
          <Button mt={15} type="submit" loading={isChangingPassword}>
            <IconDeviceFloppy /> Save
          </Button>
        </form>
        <div className="mt-4 mb-4">
          <Text>Change Security Questions</Text>
          <Divider className="mb-2" />
          <ChangeSecurity mode="update" />
        </div>
      </Container>
    </>
  );
}
