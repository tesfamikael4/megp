import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Anchor,
  Button,
  Checkbox,
  Flex,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginFormSchema), // Use zodResolver with the schema
  });

  const onSubmit = (data: LoginFormInputs) => {
    console.log(data); // Submit form data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={15} gap={10}>
        <Flex align="center" justify="center">
          <Text fw={600} fz={22}>
            Welcome Back!
          </Text>
        </Flex>
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

        <Group justify="space-between" mt="lg">
          <Checkbox
            size="xs"
            label="Keep me logged in "
            onChange={(event) => {}}
            color="#1199ee"
            fz={14}
          />
          <Anchor component="button" size="sm" fz={13}>
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth type="submit" h={40}>
          Login
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
