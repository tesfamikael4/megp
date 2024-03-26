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

const resetPasswordFormSchema = z.object({
  email: z.string().email(),
});

interface ResetPasswordFormInputs {
  email: string;
}

const ResetPasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordFormSchema), // Use zodResolver with the schema
  });

  const onSubmit = (data: ResetPasswordFormInputs) => {
    console.log(data); // Submit form data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={15} gap={14}>
        <Flex className=" flex flex-col justify-center items-center gap-6">
          <Text fw={600} fz={22}>
            Reset Password
          </Text>
          <Text fw={500} fz={14}>
            We&lsquo;ll send you a quick link to reset your password
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
        <Button fullWidth type="submit" h={40}>
          Send link
        </Button>
      </Stack>
    </form>
  );
};

export default ResetPasswordForm;
