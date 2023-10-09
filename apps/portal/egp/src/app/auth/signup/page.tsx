'use client';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Flex,
  Box,
  Divider,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doesEmailExist } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import Image from 'next/image';
import z from 'zod';
import { notifications } from '@mantine/notifications';
import styles from './page.module.scss';
import { signupWithEmailPassword } from '../supertokensUtilities';
import { Phone } from '@megp/core-fe';

const schema = z.object({
  organizationName: z.string().min(1, { message: 'This field is required.' }),
  firstName: z.string().min(1, { message: 'This field is required.' }),
  lastName: z.string().min(1, { message: 'This field is required.' }),
  phone: z.string().min(1, { message: 'This field is required.' }),
  email: z
    .string()
    .min(1, { message: 'This field is required.' })
    .email({ message: 'Please enter a valid email' }),
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

const SignUpPage = () => {
  //react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  // State
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = React.useState(false);
  const [emailExists, setEmailExists] = React.useState(false);
  const [phone, setPhone] = React.useState<string>('');

  // Functions
  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    try {
      setIsSigningUp(true);
      let response = await signupWithEmailPassword({
        password: data.password,
        organizationName: data.organizationName,
        firstName: data.firstName,
        lastName: data.lastName,
        primaryEmail: data.email,
        primaryPhone: phone,
      });
      if (response.status === 'FIELD_ERROR') {
        response.formFields.map((formField) => {
          if (formField.id === 'email') {
            setEmailExists(true);
          }
        });
      } else {
        router.push('/auth/verification');
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        //this may be a custom error message sent from the API by you.
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
      setIsSigningUp(false);
    }
  };

  async function checkEmail(email: string) {
    try {
      let response = await doesEmailExist({
        email,
      });
      setEmailExists(response.doesExist);
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    }
  }

  return (
    <Container className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper withBorder className={styles.paper_wrapper}>
          <Flex direction={'column'}>
            <Box className={styles.intro_wrapper}>
              <Image
                src="/ppda.png"
                alt="Malawi Republic"
                width={100}
                height={100}
                className={styles.image_style}
              />
              <Title
                className={styles.title}
                style={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 800,
                })}
              >
                Welcome to eGP Malawi
              </Title>
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
            <Paper
              className={styles.form_wrapper}
              styles={{ root: { backgroundColor: 'rgb(243 244 246)' } }}
            >
              <Box>
                <p className={styles.title}>Create Account</p>

                <Text c="dimmed" className="text-center">
                  Already have an account?{' '}
                  <Link href="/auth/login" className={styles.sign_in}>
                    Sign In
                  </Link>
                </Text>
                <TextInput
                  label="Name of the Business/Company"
                  placeholder="Name of the Business/Company"
                  className="mt-3"
                  error={errors.organizationName?.message}
                  {...register('organizationName')}
                  withAsterisk
                />
                <Flex direction={'row'} className="gap-2">
                  <TextInput
                    label="First Name"
                    placeholder="First name"
                    className="w-1/2"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                    withAsterisk
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Last name"
                    className="w-1/2"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                    withAsterisk
                  />
                </Flex>
                <Phone
                  label="Mobile Phone"
                  placeholder="Your phone"
                  value={phone}
                  onChange={setPhone}
                />
                <TextInput
                  label="Email"
                  placeholder="Your email"
                  error={
                    errors.email?.message ||
                    (emailExists ? 'This email already exists' : '')
                  }
                  onBlurCapture={(event) =>
                    checkEmail(event.currentTarget.value)
                  }
                  {...register('email')}
                  withAsterisk
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  error={errors.password?.message}
                  {...register('password')}
                  withAsterisk
                />
                <Flex className={styles.sign_up_wrapper}>
                  <Button
                    type="submit"
                    className={styles.sign_up_button}
                    loading={isSigningUp}
                    onClick={() => setEmailExists(false)}
                  >
                    Create Account
                  </Button>
                </Flex>
              </Box>
            </Paper>
          </Flex>
        </Paper>
      </form>
    </Container>
  );
};

export default SignUpPage;
