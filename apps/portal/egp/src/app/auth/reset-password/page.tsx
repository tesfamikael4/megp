'use client';
import {
  Container,
  Paper,
  PasswordInput,
  Button,
  Title,
  Flex,
  Text,
} from '@mantine/core';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useState } from 'react';
import { IconChecks, IconCircleX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { resetPassword } from '../supertokensUtilities';

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

export default function PasswordResetPage() {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    try {
      setLoading(true);
      let response = await resetPassword({
        password: data.password,
      });
      setResponse(response.status);
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        notifications.show({
          title: 'Error',
          message: err.message,
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Oops! Something went wrong!',
          color: 'red',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="w-11/12 md:w-2/6">
      <Paper withBorder className="p-4 md:p-10 rounded-lg">
        <Image
          src="/forgot-password.svg"
          height={300}
          width={300}
          alt="forgot-password"
          className="mx-auto"
        />
        {response === 'FIELD_ERROR' && (
          <>
            <IconCircleX color="red" size={48} className="mx-auto" />
            <Text align="center">Password does not meet requirements.</Text>
          </>
        )}
        {response === 'RESET_PASSWORD_INVALID_TOKEN_ERROR' && (
          <>
            <IconCircleX color="red" size={48} className="mx-auto" />
            <Text align="center">Password reset failed. Please try again.</Text>
          </>
        )}
        {response === 'OK' && (
          <>
            <Flex direction={'column'}>
              <IconChecks color="#3d692c" size={48} className="mx-auto" />
              <Text align="center" size={'xl'}>
                Password reset successful!
              </Text>
              <Button
                className="mt-6"
                onClick={() => router.push('/auth/login')}
              >
                Log in with new password
              </Button>
            </Flex>
          </>
        )}
        {!response && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction={'column'}>
              <Title align="center">Reset Password</Title>
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
        )}
      </Paper>
    </Container>
  );
}
