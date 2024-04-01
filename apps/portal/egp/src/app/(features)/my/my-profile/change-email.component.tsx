import {
  useChangeEmailMutation,
  useConfirmNewEmailMutation,
  useConfirmOldEmailMutation,
} from '@/store/api/user/user.api';
import {
  Divider,
  Paper,
  Button,
  Stack,
  Flex,
  TextInput,
  Group,
  PinInput,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';

const PinInputComponent = ({
  mode,
  verificationId,
  setMode,
  setVerificationId,
}: {
  mode: string;
  verificationId: string;
  setMode: any;
  setVerificationId: any;
}) => {
  const [disabled, setDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [value, setValue] = useState<string>();
  const [err, setErr] = useState();

  const [confirmOldOtp, { isLoading: isConfirmingOld }] =
    useConfirmOldEmailMutation();
  const [confirmNewOtp, { isLoading: isConfirmingNew }] =
    useConfirmNewEmailMutation();

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

  const submitOldOtp = async (value, mode) => {
    try {
      const res =
        mode == 'oldConfirm'
          ? await confirmOldOtp({
              verificationId,
              otp: value,
              isOtp: true,
            }).unwrap()
          : await confirmNewOtp({
              verificationId,
              otp: value,
              isOtp: true,
            }).unwrap();
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `${mode == 'oldConfirm' ? 'Otp confirmed successfully.' : 'Email changed successfully.'}`,
      });
      setVerificationId(res?.verificationId);
      mode == 'oldConfirm' && setMode('newConfirm');
      mode == 'newConfirm' && location.reload();
    } catch (error) {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <Stack className="items-center">
      {mode == 'oldConfirm' ? (
        <Text>Please enter otp sent to your old email.</Text>
      ) : (
        <Text>Please enter otp sent to your new email.</Text>
      )}
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
          loading={isConfirmingOld || isConfirmingNew}
          onClick={async () => {
            submitOldOtp(value, mode);
          }}
          w={145}
        >
          Continue
        </Button>
      </Group>
    </Stack>
  );
};

export default function ChangeEmail() {
  const [
    changeEmailRequest,
    { data: changeEmailResponse, isLoading: isRequesting },
  ] = useChangeEmailMutation();

  const [newEmail, setNewEmail] = useState('');
  const [mode, setMode] = useState<'request' | 'oldConfirm' | 'newConfirm'>(
    'request',
  );
  const [verificationId, setVerificationId] = useState('');

  const handleChangeEmailRequest = async () => {
    try {
      const res = await changeEmailRequest({ newEmail: newEmail }).unwrap();
      notifications.show({
        title: 'Success',
        color: 'green',
        message: 'Otp Sent Successfully',
      });
      setVerificationId(res?.verificationId);
      setMode('oldConfirm');
    } catch (error) {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <div>
      <Paper className="p-10 mt-4" shadow="sm" withBorder>
        <Flex direction={'column'} className="mb-4">
          <p className="font-semibold text-xl">Change Email</p>
          <Divider />
        </Flex>
        {mode == 'request' && (
          <Stack>
            <TextInput
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
            />
            <Button
              className="mr-auto"
              onClick={handleChangeEmailRequest}
              loading={isRequesting}
            >
              Change Email
            </Button>
          </Stack>
        )}
        {mode == 'oldConfirm' && (
          <PinInputComponent
            verificationId={verificationId}
            setVerificationId={setVerificationId}
            setMode={setMode}
            mode={mode}
          />
        )}
        {mode == 'newConfirm' && (
          <PinInputComponent
            verificationId={verificationId}
            setVerificationId={setVerificationId}
            setMode={setMode}
            mode={mode}
          />
        )}
      </Paper>
    </div>
  );
}
