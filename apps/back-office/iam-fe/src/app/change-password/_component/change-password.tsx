'use client';

import {
  Divider,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSetPasswordMutation } from '../_api/password.api';

import { useForm } from 'react-hook-form';
import { notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';
import Image from 'next/image';
import styles from '../auth.module.scss';
import ppda from '../../../../public/ppda.png';
import { useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';

const defaultValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

interface Password {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserpasswordForm() {
  const profileSchema: ZodType<Password> = z
    .object({
      oldPassword: z
        .string()
        .min(1, { message: 'This field is required.' })
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(/[a-zA-Z]/, {
          message: 'Password must have at least one alphabet character',
        })
        .regex(/[0-9]/, { message: 'Password must have at least one number' }),
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

  const route = useRouter();

  const [create, { isLoading: isSaving }] = useSetPasswordMutation();

  const onCreate = async (data) => {
    try {
      await create({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      notify('Success', 'Password changed successfully');
      route.push('/');
    } catch (err) {
      notify('Error', 'Errors in changing password.');
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  return (
    <div className="flex flex-row justify-center align-center items-center mt-8 min-w-max">
      <Paper
        radius="md"
        p="xl"
        withBorder
        mih={'70vh'}
        w={500}
        className="flex  flex-col  align-middle"
      >
        <Flex align="center" onClick={() => route.push('/')}>
          <IconChevronLeft />
          Back
        </Flex>
        <Image
          alt="Malawi Republic"
          className={styles.logo}
          height={100}
          src={ppda.src}
          sizes="sm"
          width={100}
        />
        <Divider my="lg" />
        <Stack pos={'relative'}>
          <PasswordInput
            label="Previous password"
            required
            {...register('oldPassword')}
            error={
              errors?.oldPassword
                ? errors?.oldPassword?.message?.toString()
                : ''
            }
          />
          <PasswordInput
            required
            label="New Password"
            {...register('newPassword')}
            error={
              errors?.newPassword
                ? errors?.newPassword?.message?.toString()
                : ''
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
      </Paper>
    </div>
  );
}
