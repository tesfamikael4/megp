'use client';
import { Button, Flex, PasswordInput, Title } from '@mantine/core';
import { useState } from 'react';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../../context/auth.context';
import { ChangeSecurity } from '../setSecurity/change-security';

export interface Response {
  verificationId: string;
  otp: string;
  isOtp: boolean;
}

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

export function SecurityQPassReset(): JSX.Element {
  const [content, setContent] = useState<'content1' | 'content2'>('content1');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [response, setResponse] = useState<Response>({
    verificationId: '',
    otp: '',
    isOtp: true,
  });
  const router = useRouter();
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    try {
      setIsChangingPassword(true);
      const resetPass = await resetPassword({
        ...response,
        password: data.password,
      });
      if (!resetPass) {
        return;
      }
      if (resetPass.statusCode === 400) {
        notifications.show({
          title: 'Error',
          color: 'red',
          message: 'Check username or security answers.',
        });
      } else {
        notifications.show({
          title: 'Success',
          color: 'green',
          message: 'Password changed successfully',
        });
        router.push('/auth/login');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };
  return (
    <div>
      {content === 'content1' && (
        <ChangeSecurity
          mode="reset-password"
          setContent={setContent}
          setResponse={setResponse}
        />
      )}
      {content === 'content2' && (
        <div>
          <Flex direction="column">
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
                <Button
                  className="mt-4"
                  loading={isChangingPassword}
                  type="submit"
                >
                  Change Password
                </Button>
              </Flex>
            </form>
          </Flex>
        </div>
      )}
    </div>
  );
}
