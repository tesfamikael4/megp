'use client';
import { useState } from 'react';
import { TextInput, Button, Flex, Stack, Text } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth.context';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type FormSchema = z.infer<typeof schema>;

export function ForgotPassword(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { forgetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    try {
      setLoading(true);
      const response = await forgetPassword(data.email);
      if (response?.message) {
        notifications.show({
          title: 'Error',
          color: 'red',
          message: response.message,
        });
      } else {
        router.push(`/auth/otp-reset/${response?.verificationId}`);
      }
      // reset password email sent.
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack className="mt-6 md:mt-0" gap={10}>
        <Flex align="center" justify="center" mb={10} visibleFrom="md">
          <Text fw={600} fz={22}>
            Reset Password
          </Text>
        </Flex>
        <Text fw={500} fz={14}>
          We&lsquo;ll send you a quick link to reset your password
        </Text>
        <TextInput
          error={errors.email?.message}
          label="Email"
          leftSection={<IconAt size="0.8rem" />}
          placeholder="Your email"
          {...register('email')}
          className="mt-3"
          required
        />
        <Button fullWidth h={40} loading={loading} type="submit">
          Send link
        </Button>
        {/* <Divider label="Or" labelPosition="center" />
        <Button
          fullWidth
          h={40}
          onClick={() => {
            router.push('/auth/questions');
          }}
          variant="outline"
        >
          Reset Using Security Questions
        </Button> */}
      </Stack>
    </form>
  );
}
