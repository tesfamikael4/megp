'use client';
import { useState } from 'react';
import {
  Container,
  Paper,
  Text,
  TextInput,
  Button,
  Flex,
  Box,
  Title,
} from '@mantine/core';
import Image from 'next/image';
import { IconAt } from '@tabler/icons-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { IconChecks } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { requestPassword } from '../supertokensUtilities';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type FormSchema = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    try {
      setLoading(true);
      let response = await requestPassword({
        email: data.email,
      });
      setResponse(response.status);
      // reset password email sent.
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        notifications.show({
          title: 'Error',
          message: err.message,
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Oops! Something went wrong.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maw={550}>
      <Paper withBorder className="p-3 md:p-5">
        <Flex direction={'column'}>
          <Image
            src="/forgot-password.svg"
            width={300}
            height={300}
            alt="forgot-password"
            className="mx-auto"
          />
          <Title align="center">Reset Password</Title>
          {response === 'OK' && (
            <Box className="mt-4">
              <IconChecks color="#3d692c" size={48} className="mx-auto" />
              <Text align="center">
                We have sent you a reset link to the email you provided. Please
                click on the link to proceed reseting your password.
              </Text>
            </Box>
          )}
          {response === 'FIELD_ERROR' && (
            <Text>Oops! Something went wrong.</Text>
          )}
          {!response && (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <TextInput
                label="Email"
                description="Please enter your email below so we can send you a reset link: "
                placeholder="Your email"
                icon={<IconAt size="0.8rem" />}
                error={errors.email?.message}
                {...register('email')}
                className="mt-4"
              ></TextInput>
              <Button className="mt-6" type="submit" loading={loading}>
                Send link
              </Button>
            </form>
          )}
        </Flex>
      </Paper>
    </Container>
  );
}
