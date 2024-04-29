'use client';
import {
  TextInput,
  PasswordInput,
  Text,
  Button,
  Flex,
  Stack,
  Checkbox,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../../context';
import { Phone, isPhoneValid } from '../../phone-input/phone-input';

const schema = z.object({
  firstName: z.string().min(1, { message: 'This field is required.' }),
  lastName: z.string().min(1, { message: 'This field is required.' }),
  phone: z
    .string()
    .min(1, { message: 'This field is required.' })
    .refine((data) => isPhoneValid(data), {
      message: 'Invalid Phone Number',
    }),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  // State
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = useState(false);
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
      <Stack gap={4} mt={25}>
        <Flex align="center" justify="center" mb={10}>
          <Text fw={600} fz={22}>
            Welcome to MANEPS!
          </Text>
        </Flex>
        <Flex gap="xs">
          <TextInput
            error={errors.firstName?.message}
            label="First Name"
            placeholder="First name"
            {...register('firstName')}
            required
            size="sm"
            withAsterisk
          />
          <TextInput
            error={errors.lastName?.message}
            label="Last Name"
            placeholder="Last name"
            {...register('lastName')}
            withAsterisk
          />
        </Flex>
        <Controller
          control={control}
          name="phone"
          render={({ field: { name, value, onChange } }) => (
            <Phone
              disableValidation
              error={errors.phone?.message}
              label="Mobile Phone"
              name={name}
              onChange={onChange}
              placeholder="Your phone"
              value={value}
            />
          )}
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
          size="sm"
          {...register('password')}
          withAsterisk
        />

        <Checkbox label="Keep me logged in " mb="xs" mt="lg" size="xs" />
        <Button fullWidth h={40} loading={isSigningUp} type="submit">
          Sign up
        </Button>
      </Stack>
    </form>
  );
}
