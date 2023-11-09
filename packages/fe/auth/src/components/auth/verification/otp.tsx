'use client';
import React, { useEffect, useState } from 'react';
import { PinInput, Title, Text, Button, Flex } from '@mantine/core';
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
    <div className="flex flex-col items-center">
      <Title className="text-center">OTP Verification</Title>
      <Text>Please enter the OTP code you recieved in your email.</Text>
      <PinInput
        className="text-center mt-10 mb-5"
        error={err}
        length={6}
        onChange={(otpValue) => {
          setValue(otpValue);
          setErr(undefined);
        }}
        oneTimeCode
        type="number"
      />
      <Flex className="w-full" justify="space-around">
        <Button disabled={disabled} onClick={handleResendClick}>
          Resend Code ({formatTime(countdown)})
        </Button>
        <Button loading={isSubmitting} onClick={async () => submitOTP(value)}>
          Continue
        </Button>
      </Flex>
    </div>
  );
}
