'use client';
import {
  Container,
  Paper,
  PasswordInput,
  Button,
  Title,
  Flex,
} from '@mantine/core';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../../context/auth.context';

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

export function PasswordReset(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    try {
      setLoading(true);
      const response = await resetPassword({
        verificationId: '',
        password: data.password,
        otp: '',
        isOtp: true,
      });
      if (!response) {
        return;
      }
      if (response.message) {
        notifications.show({
          title: 'Error',
          color: 'red',
          message: response.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Paper className="p-4 md:p-10 rounded-lg" withBorder>
        <Image
          alt="forgot-password"
          className="mx-auto"
          height={300}
          src="/forgot-password.svg"
          width={300}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column">
            <Title className="text-center">Reset Password</Title>
            <PasswordInput
              label="New Password"
              {...register('password')}
              error={errors.password?.message}
            />
            <Button className="mt-4" loading={loading}>
              Change Password
            </Button>
          </Flex>
        </form>
      </Paper>
    </Container>
  );
}
