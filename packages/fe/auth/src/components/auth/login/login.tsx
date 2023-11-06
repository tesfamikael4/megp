'use client';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Title,
  Text,
  Group,
  Button,
} from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { notifications } from '@mantine/notifications';
import { setCookie } from 'cookies-next';
import { useAuth } from '../../../context/auth.context';
import styles from './login.module.scss';

const schema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .required();

type FormSchema = z.infer<typeof schema>;

export function Login(): JSX.Element {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormSchema): Promise<void> => {
    try {
      setIsSigningIn(true);
      const res = await login(data);
      if (!res) {
        return;
      }
      if (res.message) {
        notifications.show({
          title: 'Error',
          color: 'red',
          message: 'The email or password you entered is incorrect.',
        });
      } else if (res.is_security_question_set) {
        setCookie('token', res.access_token);
        setCookie('refreshToken', res.refresh_token);
        window.location.href = '/';
      } else {
        setCookie('token', res.access_token);
        setCookie('refreshToken', res.refresh_token);
        window.location.href = '/auth/setSecurity';
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title
        className="text-center"
        style={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 750,
        })}
      >
        Sign In
      </Title>
      <TextInput
        error={errors.username?.message}
        label="Email / Username"
        placeholder="Your email"
        {...register('username')}
      />
      <PasswordInput
        error={errors.password?.message}
        label="Password"
        placeholder="Your password"
        {...register('password')}
        mt="md"
      />
      <Group className={styles.group} justify="space-between">
        <Checkbox label="Remember me" style={{ lineHeight: 1 }} />
        <Link
          className="text-green-700 hover:text-green-800"
          href="/auth/forgot-password"
        >
          Forgot password?
        </Link>
      </Group>
      <Button className="mt-4" fullWidth loading={isSigningIn} mt="xl">
        Sign in
      </Button>
      <Text c="dimmed" className={styles.account_que}>
        Do not have an account yet?{' '}
        <Link className={styles.signup_link} href="/auth/signup">
          Create Account
        </Link>
      </Text>
    </form>
  );
}
