'use client';
import React, { useEffect, useState } from 'react';
import { PinInput, Text, Button, Flex, Stack } from '@mantine/core';
import { setCookie } from 'cookies-next';
import { notifications } from '@mantine/notifications';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth.context';

export function Otp({
  id,
  mode,
}: {
  id: string;
  mode: 'verify' | 'reset';
}): JSX.Element {
  const [err, setErr] = useState<any>();
  const [value, setValue] = useState<string>();
  const { verify, error, verifyForgetPassword } = useAuth();
  const [disabled, setDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0 && disabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setDisabled(false);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, disabled]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    setErr(error);
  }, [error]);

  const handleResendClick = () => {
    setDisabled(true);
    setCountdown(60);
  };

  const submitOTP = async (otp) => {
    try {
      setIsSubmitting(true);
      if (mode === 'verify') {
        const response = await verify({
          verificationId: id,
          otp,
          isOtp: true,
        });
        if (!response) {
          return;
        }
        if (response.statusCode) {
          notifications.show({
            title: 'Error',
            color: 'red',
            message: 'Verification Code Expired. Please resend.',
          });
        } else {
          setCookie('token', response.access_token);
          setCookie('refreshToken', response.refresh_token);
          window.location.href = '/auth/setSecurity';
        }
      } else {
        const response = await verifyForgetPassword({
          verificationId: id,
          otp,
          isOtp: true,
        });
        if (!response) {
          return;
        }
        if (response.statusCode) {
          notifications.show({
            title: 'Error',
            color: 'red',
            message: 'Verification Code Expired. Please resend.',
          });
        } else {
          const modifiedUrl = path.replace(/\/auth/g, '');
          router.push(`/auth/otp/${modifiedUrl}/${otp}`);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleResendClick = () => {
  // };

  return (
    <Stack className="mt-6 md:mt-0" gap={10}>
      <Flex align="center" justify="center" mb={10}>
        <Text fw={600} fz={22}>
          OTP verification
        </Text>
      </Flex>
      <Text fw={500} fz={14}>
        Please enter the OTP code you received in your email.
      </Text>
      <PinInput
        className="text-center w-full justify-center"
        error={err}
        length={6}
        onChange={(otpValue) => {
          setValue(otpValue);
          setErr(undefined);
        }}
        oneTimeCode
        type="number"
      />

      <Flex gap="sm" justify="center" mt="md">
        <Button disabled={disabled} h={40} onClick={handleResendClick} w={145}>
          Resend Code ({formatTime(countdown)})
        </Button>
        <Button
          h={40}
          loading={isSubmitting}
          onClick={async () => submitOTP(value)}
          w={145}
        >
          Continue
        </Button>
      </Flex>
    </Stack>
  );
}
