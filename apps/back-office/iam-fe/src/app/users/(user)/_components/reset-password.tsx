'use client';

import { Stack, PasswordInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPasswordMutation } from '../../_api/custom.api';
import { useForm } from 'react-hook-form';
import { notify, logger } from '@megp/core-fe';
import { useAuth } from '@megp/auth';
import { useReadQuery } from '../../_api/user.api';
import { useParams } from 'next/navigation';

const defaultValues = {
  oldPassword: '',
  newPassword: '',
};

interface Password {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const profileSchema: ZodType<Password> = z
    .object({
      newPassword: z
        .string()
        .min(1, { message: 'This field is required.' })
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(/[a-zA-Z]/, {
          message: 'Password must have at least one alphabet character',
        })
        .regex(/[0-9]/, { message: 'Password must have at least one number' }),
      confirmPassword: z.string(),
    })
    .refine(
      (values) => {
        return values.newPassword === values.confirmPassword;
      },
      {
        message: 'Passwords must match',
        path: ['confirmPassword'],
      },
    );

  const {
    handleSubmit,
    reset,
    formState: { errors },

    register,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useResetPasswordMutation();

  const { data: selected } = useReadQuery(id?.toString());

  const onCreate = async (data) => {
    try {
      await create({
        accountId: selected.accountId,
        password: data.newPassword,
      }).unwrap();

      notify('Success', 'Password reset successfully');
    } catch (err) {
      logger.log(err);
      notify('Error', 'Errors in resetting password.');
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  return (
    <Stack>
      <PasswordInput
        required
        label="New Password"
        {...register('newPassword')}
        error={
          errors?.newPassword ? errors?.newPassword?.message?.toString() : ''
        }
      />
      <PasswordInput
        required
        label="Confirm Password"
        {...register('confirmPassword')}
        error={
          errors?.confirmPassword
            ? errors?.confirmPassword?.message?.toString()
            : ''
        }
      />

      <EntityButton
        mode="new"
        onCreate={handleSubmit(onCreate)}
        onReset={onReset}
        isSaving={isSaving}
      />
    </Stack>
  );
}
