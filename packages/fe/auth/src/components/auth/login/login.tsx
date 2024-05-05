'use client';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Text,
  Button,
  Stack,
  Flex,
  Anchor,
} from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { notifications } from '@mantine/notifications';
import { setCookie } from 'cookies-next';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAuth } from '../../../context/auth.context';
import GoogleCaptchaWrapper from '../../page-wrapper/google-captcha-wrapper';

const schema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .required();

type FormSchema = z.infer<typeof schema>;

export function Login({
  app,
  basePath,
}: {
  app?: 'bo' | 'portal';
  basePath?: string;
}): JSX.Element {
  return (
    <GoogleCaptchaWrapper>
      <LoginComponent app={app} basePath={basePath} />
    </GoogleCaptchaWrapper>
  );
}

function LoginComponent({
  app,
  basePath,
}: {
  app?: 'bo' | 'portal';
  basePath?: string;
}): JSX.Element {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { login } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const handleSubmitForm = function (data: FormSchema) {
    if (!executeRecaptcha) {
      notifications.show({
        title: 'Execute recaptcha not available yet',
        message: 'Execute recaptcha not available yet',
        color: 'red',
      });
      return;
    }
    executeRecaptcha('enquiryFormSubmit')
      .then((gReCaptchaToken) => {
        onSubmit(data, gReCaptchaToken);
      })
      .catch(() => {
        null;
      });
  };

  const onSubmit = (data: FormSchema, gReCaptchaToken: string) => {
    async function goAsync() {
      try {
        setIsSigningIn(true);
        const res = await login({ ...data, gReCaptchaToken });
        if (!res) {
          return;
        }
        if (res.message) {
          notifications.show({
            title: 'Error',
            color: 'red',
            message: 'The email or password you entered is incorrect.',
          });
        } else if (app === 'bo') {
          setCookie('token', res.access_token);
          setCookie('refreshToken', res.refresh_token);
          window.location.href = `${basePath}`;
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
    }
    goAsync().catch(() => {
      null;
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Stack className="mt-6 md:mt-0" gap={4}>
        <Flex align="center" justify="center" mb={10}>
          <Text fw={600} fz={22}>
            Welcome Back!
          </Text>
        </Flex>
        <TextInput
          error={errors.username?.message}
          label="Email / Username"
          placeholder="Your email"
          {...register('username')}
        />
        <PasswordInput
          error={errors.password?.message}
          label="Password"
          placeholder="**********"
          {...register('password')}
          mt="md"
        />
        <Flex justify="space-between" mb="xs" mt="lg">
          <Checkbox
            color="#1199ee"
            fz={13}
            label="Keep me logged in "
            size="xs"
          />
          {app !== 'bo' && (
            <Anchor
              component={Link}
              fz={13}
              href="/auth/forgot-password"
              size="sm"
            >
              Forgot password?
            </Anchor>
          )}
        </Flex>
        <Button fullWidth h={40} loading={isSigningIn} type="submit">
          Login
        </Button>
      </Stack>
    </form>
  );
}
