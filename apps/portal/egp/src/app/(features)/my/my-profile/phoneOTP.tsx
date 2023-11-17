'use client';

import {
  Card,
  Text,
  Container,
  Accordion,
  TextInput,
  Divider,
  Button,
  Flex,
  Tooltip,
} from '@mantine/core';
import { IconCircleCheck, IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { getCookie, setCookie } from 'cookies-next';

const schema = z.object({
  otp: z.string().min(1, { message: 'This field is required.' }),
});
type FormSchema = z.infer<typeof schema>;

export default function PhoneOTP({
  phone,
  email,
}: {
  phone: string;
  email: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });
  const [otpState, setOtpState] = useState<string>('unverified');

  const onSubmit = () => {
    setOtpState('verified');
    setCookie('otp', true);
  };

  useEffect(() => {
    const otpState = getCookie('otp');
    if (otpState) {
      setOtpState(otpState as string);
    }
  }, []);

  return (
    <div className="mt-2">
      <p className="font-semibold text-xl">Verify Your Phone Number</p>
      <Divider />
      <Flex direction="row" className="items-center gap-1 mt-3">
        <Text>
          <span className="font-medium">Email:</span> {email}
        </Text>
        <Tooltip label="Verified">
          <IconCircleCheck color="green" className="cursor-help" />
        </Tooltip>
      </Flex>
      {otpState === 'unverified' && (
        <div className="flex justify-between items-center">
          {' '}
          <Text>
            <span className="font-semibold">Phone:</span> {phone}
          </Text>
          <Button className="mt-4" onClick={() => setOtpState('sent')}>
            Request OTP
          </Button>
        </div>
      )}
      {otpState === 'sent' && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Enter OTP"
              className="mt-2"
              withAsterisk
              placeholder="Enter OTP"
              {...register('otp')}
              error={errors.otp?.message}
            />
            <Button className="mt-4" type="submit">
              Verify Code
            </Button>
          </form>
        </>
      )}
      {otpState === 'true' && (
        <div className="mt-2 flex items-center">
          <Flex direction="row" className="items-center gap-1">
            <Text>
              <span className="font-medium">Phone:</span> {phone}
            </Text>
            <IconCircleCheck color="green" />
          </Flex>
        </div>
      )}
    </div>
  );
}
