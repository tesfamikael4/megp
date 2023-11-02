'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PinInput, Title, Text, Button, Flex } from '@mantine/core';
import { useAuth } from '@megp/core-fe/src/context/auth.context';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useTimeout } from '@mantine/hooks';

export default function OTP() {
  const { id } = useParams();
  const [err, setErr] = useState();
  const { verify, error, verifyForgetPassword } = useAuth();
  const router = useRouter();
  const [disabled, setIsDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const { start, clear } = useTimeout(() => setIsDisabled(true), 1000);
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0 && disabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsDisabled(false);
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
    setIsDisabled(true);
    setCountdown(60);
  };

  const submitOTP = async (value) => {
    const response = await verify({
      verificationId: id as string,
      otp: value,
      isOtp: true,
    });
    if (!response) {
      return;
    }
    if (response['access_token']) {
      router.push('/');
      setCookie('token', response['access_token']);
      setCookie('refreshToken', response['refresh_token']);
    } else {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: response['message'],
      });
    }
  };

  // const handleResendClick = () => {
  //   setIsDisabled(true);
  //   setCountdown(60); // Reset the countdown time
  //   setTimeout(() => {
  //     setIsDisabled(false);
  //   }, 1000);
  // };

  return (
    <div className="flex flex-col items-center">
      <Title className="text-center">OTP Verification</Title>
      <Text>Please enter the OTP code you recieved in your email.</Text>
      <PinInput
        className="text-center mt-10 mb-5"
        type="number"
        oneTimeCode
        length={6}
        onChange={() => {
          setErr(undefined);
        }}
        onComplete={(value) => {
          submitOTP(value);
        }}
        error={err}
      />
      <Flex className="gap-8">
        <Button disabled={disabled} onClick={handleResendClick}>
          Resend Code ({formatTime(countdown)})
        </Button>
        <Button>Continue</Button>
      </Flex>
    </div>
  );
}
