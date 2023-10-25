'use client';
import ChangeSecurity from '@/app/(features)/my/security/changeSecurity';
import {
  Button,
  Flex,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import React from 'react';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useChangePassWithQueMutation } from '@/store/api/auth/auth.api';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export type Response = {
  status: string;
  superTokenUserId: string;
  token: string;
};

const schema = z.object({
  password: z
    .string()
    .min(1, { message: 'This field is required.' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-zA-Z]/, {
      message: 'Password must have at least one alphabet character',
    })
    .regex(/[0-9]/, { message: 'Password must have at least one number' }),
});

type FormSchema = z.infer<typeof schema>;

export default function SecurityQPassReset() {
  const [content, setContent] = useState<'content1' | 'content2'>('content1');
  const [response, setResponse] = useState<Response>({
    status: '',
    superTokenUserId: '',
    token: '',
  });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePassWithQueMutation();

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    await changePassword({
      password: data.password,
      superTokenUserId: response.superTokenUserId,
      token: response.token,
    })
      .unwrap()
      .then((res) => {
        if (res.status === 'OK') {
          notifications.show({
            title: 'Success',
            message: 'Password Changed Successfully',
          });
          router.push('/auth/login');
        } else {
          notifications.show({
            title: 'Error',
            message: res.message,
          });
        }
      })
      .catch((err) => {
        notifications.show({
          title: 'Error',
          message: err.message,
        });
      });
  };

  return (
    <div
      className={`${
        content === 'content1' ? 'min-w-[40vw] shadow-md p-4 rounded-md' : ''
      }`}
    >
      {content === 'content1' && (
        <ChangeSecurity
          mode="reset-password"
          setContent={setContent}
          setResponse={setResponse}
        />
      )}
      {content === 'content2' && (
        <div>
          <Paper withBorder className="p-3 md:p-5">
            <Flex direction={'column'}>
              <Image
                src="/forgot-password.svg"
                width={300}
                height={300}
                alt="forgot-password"
                className="mx-auto"
              />
              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction={'column'}>
                  <Title className="text-center">Reset Password</Title>
                  <PasswordInput
                    label="New Password"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <Button
                    className="mt-4"
                    type="submit"
                    loading={isChangingPassword}
                  >
                    Change Password
                  </Button>
                </Flex>
              </form>
            </Flex>
          </Paper>
        </div>
      )}
    </div>
  );
}
