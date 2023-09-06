'use client';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Flex,
  Box,
  Divider,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'supertokens-web-js/recipe/emailpassword';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { notifications } from '@mantine/notifications';
import Image from 'next/image';
import styles from './page.module.scss';

const schema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    password: z.string(),
  })
  .required();

type FormSchema = z.infer<typeof schema>;

export default function Signin() {
  const router = useRouter();
  const [response, setResponse] = React.useState<any>();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      setIsSigningIn(true);
      let response = await signIn({
        formFields: [
          {
            id: 'email',
            value: data.email,
          },
          {
            id: 'password',
            value: data.password,
          },
        ],
      });

      if (
        response.status === 'FIELD_ERROR' ||
        response.status === 'WRONG_CREDENTIALS_ERROR'
      ) {
        setResponse(response);
      } else {
        // sign in successful. The session tokens are automatically handled by
        // the frontend SDK.
        router.push('/');
      }
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
      setIsSigningIn(false);
    }
  };

  return (
    <Container className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper withBorder className={styles.paper_wrapper}>
          <Flex className={styles.flex_wrapper}>
            <Box className={styles.left_wrapper}>
              <Image
                src="/ppda.png"
                alt="Malawi Republic"
                width={200}
                height={150}
                className={styles.hero}
              />
              <Text
                className={styles.welcome}
                size={'xl'}
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 500,
                })}
              >
                Welcome to eGP Malawi
              </Text>
              <Divider my="sm" />
              <p className={styles.welcome_content}>
                The eGP Malawi Platform is a web-based, collaborative system to
                manage the full lifecycle of a tendering and contract management
                process, for both government agencies and suppliers. It offers a
                secure, interactive, dynamic environment for procurements of any
                nature, complexity or value, enforcing compliance to
                regulations, and encouraging recognized best practices.
              </p>
            </Box>
            <Box className={styles.right_wrapper}>
              <Box className={styles.form_wrapper}>
                {response?.status === 'WRONG_CREDENTIALS_ERROR' && (
                  <Flex className={styles.error_msg}>
                    <Text className={styles.error_text}>
                      The email or password you entered is incorrect.
                    </Text>
                  </Flex>
                )}
                <Title
                  className="text-center"
                  sx={(theme) => ({
                    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                    fontWeight: 900,
                  })}
                >
                  Sign In
                </Title>
                <TextInput
                  label="Username"
                  placeholder="Your user name"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  error={errors.password?.message}
                  {...register('password')}
                  mt="md"
                />
                <Group position="apart" className={styles.group}>
                  <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
                  <Link onClick={(event) => event.preventDefault()} href="#">
                    Forgot password?
                  </Link>
                </Group>
                <Button
                  fullWidth
                  mt="xl"
                  className="mt-4"
                  type="submit"
                  loading={isSigningIn}
                  onClick={() => setResponse('')}
                >
                  Sign in
                </Button>
                <Text color="dimmed" className={styles.account_que}>
                  Do not have an account yet?{' '}
                  <Link href="/auth/signup" className={styles.signup_link}>
                    Sign Up
                  </Link>
                </Text>
              </Box>
            </Box>
          </Flex>
        </Paper>
      </form>
    </Container>
  );
}
