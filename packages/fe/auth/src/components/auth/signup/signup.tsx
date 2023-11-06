'use client';
import {
  TextInput,
  PasswordInput,
  Text,
  Button,
  Flex,
  Box,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { notifications } from '@mantine/notifications';
import { Phone } from '@megp/core-fe/src/components/phone-input/phone-input';
import { useAuth } from '../../../context';
import styles from './signup.module.scss';

const schema = z.object({
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

export function SignUp(): JSX.Element {
  //react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  // State
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [phone, setPhone] = useState<string>('');
  const { signUp } = useAuth();

  // Functions
  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    try {
      setIsSigningUp(true);
      const res = await signUp(data);
      if (!res) {
        return;
      }
      if (res.verificationId) {
        router.push(`/auth/verification/${res.verificationId}`);
      } else {
        notifications.show({
          title: 'Error',
          color: 'red',
          message: 'Account exists. Please sign-in instead.',
        });
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <p className={styles.title}>Create Account</p>
        <Flex className="gap-2 mt-4" direction="row">
          <TextInput
            className={styles.half_width}
            error={errors.firstName?.message}
            label="First Name"
            placeholder="First name"
            {...register('firstName')}
            withAsterisk
          />
          <TextInput
            className={styles.half_width}
            error={errors.lastName?.message}
            label="Last Name"
            placeholder="Last name"
            {...register('lastName')}
            withAsterisk
          />
        </Flex>
        <Flex direction="column">
          <Phone
            label="Mobile Phone"
            onChange={(phoneValue: string) => {
              setPhone(phone);
              setValue('phone', phoneValue);
            }}
            placeholder="Your phone"
            value={phone}
          />
          <TextInput
            error={errors.email?.message}
            label="Email"
            placeholder="Your email"
            {...register('email')}
            withAsterisk
          />
          <PasswordInput
            error={errors.password?.message}
            label="Password"
            placeholder="Your password"
            {...register('password')}
            withAsterisk
          />
          <Button className="mt-6" loading={isSigningUp}>
            Create Account
          </Button>
          <Text c="dimmed" className={styles.account_que}>
            Already have an account?{' '}
            <Link
              className={styles.signup_link}
              href="/auth/login"
              type="submit"
            >
              Sign In
            </Link>
          </Text>
        </Flex>
      </Box>
    </form>
  );
}
