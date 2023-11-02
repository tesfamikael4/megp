'use client';
import { useState } from 'react';
import {
  Button,
  Container,
  Flex,
  Paper,
  PasswordInput,
  Title,
} from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@megp/core-fe';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import Image from 'next/image';
import { notifications } from '@mantine/notifications';

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

export default function ResetPasswordWithOTP() {
  const { id, code } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormSchema) => {
    try {
      setLoading(true);
      const resetResponse = await resetPassword({
        verificationId: id as string,
        password: data.password,
        otp: code as string,
        isOtp: true,
      });

      if (!resetResponse) {
        return;
      }

      if (resetResponse.statusCode) {
        notifications.show({
          title: 'Error',
          color: 'red',
          message: resetResponse.message,
        });
      } else {
        notifications.show({
          title: 'Success',
          message: 'Password reset successfully.',
        });
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Paper withBorder className="p-4 md:p-10 rounded-lg">
        <Image
          src="/forgot-password.svg"
          height={300}
          width={300}
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
            <Button className="mt-4" type="submit" loading={loading}>
              Change Password
            </Button>
          </Flex>
        </form>
      </Paper>
    </Container>
  );
}
