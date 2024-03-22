import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Checkbox,
  Flex,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

export const RegistrationFormSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  phoneNumber: z.string().nonempty().min(10).max(10), // Assuming phone number is 10 characters long
  email: z.string().email(),
  password: z.string().nonempty().min(6), // Minimum password length of 6 characters
});

interface RegistrationFormInputs {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormInputs>({
    resolver: zodResolver(RegistrationFormSchema),
  });

  const onSubmit = (data: RegistrationFormInputs) => {
    console.log(data); // Submit form data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={15} gap={10}>
        <Flex align="center" justify="center">
          <Text fw={600} fz={22}>
            Welcome to MNEPS!
          </Text>
        </Flex>
        <Group gap="sm">
          <TextInput
            maw={150}
            label="First Name"
            placeholder="Your First Name"
            {...register('firstName')}
            error={!!errors.firstName}
            classNames={{
              input: 'h-[32px]',
            }}
            required
          />
          <TextInput
            maw={150}
            label="Last Name"
            placeholder="Your Last Name"
            {...register('lastName')}
            error={!!errors.lastName}
            required
          />
        </Group>
        <TextInput
          label="Phone Number"
          placeholder="Your Phone Number"
          {...register('phoneNumber')}
          error={!!errors.phoneNumber}
          required
        />
        <TextInput
          label="Email"
          type="email"
          placeholder="Your Email Address"
          {...register('email')}
          error={!!errors.email}
          required
        />
        <PasswordInput
          label="Password"
          type="password"
          size="sm"
          placeholder="**********"
          {...register('password')}
          error={!!errors.password}
          required
        />
        <Checkbox
          size="xs"
          label="Keep me logged in "
          onChange={(event) => {}}
        />
        <Button fullWidth type="submit" h={40}>
          Sign up
        </Button>
      </Stack>
    </form>
  );
};

export default RegistrationForm;
