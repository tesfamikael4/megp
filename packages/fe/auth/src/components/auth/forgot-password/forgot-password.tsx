'use client';
import { useState } from 'react';
import { TextInput, Button, Flex, Title, Divider } from '@mantine/core';
import Image from 'next/image';
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
        router.push(`/auth/verification/otp/${response?.verificationId}`);
      }
      // reset password email sent.
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column">
      <Image
        alt="forgot-password"
        className="mx-auto"
        height={250}
        src="/forgot-password.svg"
        width={250}
      />
      <Title className="text-center">Reset Password</Title>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          description="Please enter your email below so we can send you a reset link: "
          error={errors.email?.message}
          label="Email"
          leftSection={<IconAt size="0.8rem" />}
          placeholder="Your email"
          {...register('email')}
          className="mt-3"
        />
        <Button className="mt-6" loading={loading} type="submit">
          Send link
        </Button>{' '}
        <Divider label="Or" labelPosition="center" my="xs" />
        <Button
          className="underline text-center text-green-700 cursor-pointer"
          onClick={() => {
            router.push('/auth/questions');
          }}
          variant="outline"
        >
          Reset Using Security Questions
        </Button>
      </form>
    </Flex>
  );
}
