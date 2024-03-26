import React, { useEffect, useState } from 'react';
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
  PinInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

const otpFormSchema = z.object({
  otp: z.string().min(6),
});

interface OtpFormSchema {
  otp: string;
}

const OtpForm: React.FC = () => {
  const [disabled, setDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormSchema>({
    resolver: zodResolver(otpFormSchema), // Use zodResolver with the schema
  });

  const onSubmit = (data: OtpFormSchema) => {
    console.log(data); // Submit form data
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

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
  const handleResendClick = () => {
    setDisabled(true);
    setCountdown(60);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex mt={15} gap={20} className="flex-col justify-center items-center">
        <Flex className=" flex flex-col justify-center items-center gap-6">
          <Text fw={600} fz={22}>
            OTP verification
          </Text>
          <Text fw={500} fz={14}>
            Otp code is sent to johndoe@gmail.com
          </Text>
        </Flex>
        <PinInput
          className="text-center"
          length={6}
          oneTimeCode
          type="number"
          {...register('otp')}
          onChange={(value) =>
            register('otp').onChange({
              target: {
                value,
              },
            })
          }
          error={!!errors.otp}
        />

        <Group justify="space-between" mt="lg">
          <Button
            w={160}
            h={40}
            disabled={disabled}
            onClick={handleResendClick}
          >
            Resend Code ({formatTime(countdown)})
          </Button>
          <Button
            w={160}
            h={40}
            loading={isSubmitting}
            onClick={async () => console.log()}
          >
            Continue
          </Button>
        </Group>
      </Flex>
    </form>
  );
};

export default OtpForm;
