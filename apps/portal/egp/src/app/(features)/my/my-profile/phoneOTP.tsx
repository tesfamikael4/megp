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
import { IconChecks } from '@tabler/icons-react';

const schema = z.object({
  otp: z.string().min(1, { message: 'This field is required.' }),
});
type FormSchema = z.infer<typeof schema>;

export default function PhoneOTP({ phone }: { phone: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });
  const [otpState, setOtpState] = useState<string>('unverified');

  const onSubmit = () => {
    setOtpState('verified');
  };

  return (
    <div className="mt-2">
      <p className="font-semibold text-xl">Verify Your Phone Number</p>
      <Divider className="mt-2" />
      {otpState === 'unverified' && (
        <div className="flex justify-between items-center">
          {' '}
          <Text>Phone: {phone}</Text>
          <Button className="mt-4" onClick={() => setOtpState('sent')}>
            Request OTP
          </Button>
        </div>
      )}
      {otpState === 'sent' && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Enter OTP"
            className="mt-2"
            withAsterisk
            placeholder="Enter OTP"
            {...register('otp')}
            error={errors.otp?.message}
          />
          <Button type="submit" className="mt-4">
            Verify Code
          </Button>
        </form>
      )}
      {otpState === 'verified' && (
        <div className="mt-2 flex items-center">
          <IconChecks color="green" />
          <Text>Phone number verified</Text>
        </div>
      )}
    </div>
  );
}
