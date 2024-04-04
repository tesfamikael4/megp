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
  Group,
  Stack,
  PinInput,
} from '@mantine/core';
import { IconCircleCheck, IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { getCookie, setCookie } from 'cookies-next';
import { useAuth } from '@megp/auth';
import {
  useConfirmPhoneMutation,
  useRequestConfirmPhoneMutation,
} from '@/store/api/user/user.api';
import { notifications } from '@mantine/notifications';

const schema = z.object({
  otp: z.string().min(1, { message: 'This field is required.' }),
});
type FormSchema = z.infer<typeof schema>;

const PinInputComponent = ({
  verificationId,
  setVerificationId,
}: {
  verificationId: string;
  setVerificationId: any;
}) => {
  const [disabled, setDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [value, setValue] = useState<string>();
  const [err, setErr] = useState();

  const [confirmPhoneOtp, { isLoading: isConfirmingOtp }] =
    useConfirmPhoneMutation();

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

  const submitOldOtp = async (value) => {
    try {
      const res = await confirmPhoneOtp({
        verificationId,
        otp: value,
        isOtp: true,
      }).unwrap();

      notifications.show({
        title: 'Success',
        color: 'green',
        message: `${'Otp confirmed successfully.'}`,
      });
      location.reload();
    } catch (error) {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: 'Invalid otp entered.',
      });
    }
  };
  return (
    <Stack className="items-center">
      <Text>Please enter otp sent to your phone.</Text>

      <PinInput
        className="text-center mt-8 mb-5"
        error={err}
        length={6}
        onChange={(otpValue) => {
          setValue(otpValue);
          setErr(undefined);
        }}
        oneTimeCode
        type="number"
      />

      <Group justify="space-between" mt="md">
        <Button
          disabled={disabled}
          h={40}
          // onClick={handleResendClick}
          w={145}
        >
          Resend Code ({formatTime(countdown)})
        </Button>
        <Button
          h={40}
          loading={isConfirmingOtp}
          onClick={async () => {
            submitOldOtp(value);
          }}
          w={145}
        >
          Continue
        </Button>
      </Group>
    </Stack>
  );
};

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
  const { user } = useAuth();
  const [otpState, setOtpState] = useState<string>(user?.isPhoneVerified);
  const [verificationId, setVerificationId] = useState<string>('');
  const [requestPhoneOtp, { isLoading: isRequesting }] =
    useRequestConfirmPhoneMutation();

  useEffect(() => {
    const otpState = getCookie('otp');
    if (otpState) {
      setOtpState(otpState as string);
    }
  }, []);

  const handleRequestConfirmPhone = async () => {
    try {
      const res = await requestPhoneOtp({}).unwrap();
      setVerificationId(res?.verificationId);
      setOtpState('sent');
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `${'OTP sent successfully.'}`,
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: 'OTP could not be sent.',
      });
    }
  };

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
      {!otpState && (
        <div className="flex justify-between items-center">
          {' '}
          <Text>
            <span className="font-semibold">Phone:</span> {phone}
          </Text>
          <Button
            className="mt-4"
            onClick={handleRequestConfirmPhone}
            loading={isRequesting}
          >
            Request OTP
          </Button>
        </div>
      )}
      {otpState === 'sent' && (
        <>
          <PinInputComponent
            verificationId={verificationId}
            setVerificationId={setVerificationId}
          />
        </>
      )}
      {otpState && (
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
