'use client';

import {
  Card,
  Text,
  Container,
  Accordion,
  TextInput,
  Divider,
  Button,
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import PhoneOTP from './phoneOTP';

const schema = z.object({
  firstName: z.string().min(1, { message: 'This field is required.' }),
  lastName: z.string().min(1, { message: 'This field is required.' }),
});
type FormSchema = z.infer<typeof schema>;

export default function MyProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    // console.log(data)
  };

  return (
    <Container className="mt-10">
      <Text>Update profile</Text>
      <Divider className="mb-2" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="First Name"
          withAsterisk
          placeholder="First Name"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <Divider my={15} />
        <TextInput
          label="Last Name"
          withAsterisk
          placeholder="Last Name"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
        <Button mt={15} type="submit">
          <IconDeviceFloppy /> Update
        </Button>
      </form>

      <PhoneOTP />
    </Container>
  );
}
