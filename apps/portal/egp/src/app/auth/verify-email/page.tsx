'use client';
import { useEffect, useState } from 'react';
import { verifyEmail } from 'supertokens-web-js/recipe/emailverification';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Box, Button, Container, Text } from '@mantine/core';
import { LoadingOverlay } from '@mantine/core';

export default function ConsumeVerification() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    consumeVerificationCode();
  }, []);

  async function consumeVerificationCode() {
    try {
      setLoading(true);
      let response = await verifyEmail();
      if (response.status === 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR') {
        // This can happen if the verification code is expired or invalid.
        // You should ask the user to retry
        setError(
          'Oops! Seems like the verification link expired. Please try again',
        );
      } else {
        // email was verified successfully.
        router.push('/auth/login');
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        notifications.show({
          title: 'Error',
          message: err.message,
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Oops! Something went wrong!',
          color: 'red',
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <LoadingOverlay visible={loading} />
      {error ? (
        <Box>
          <Text>{error}</Text>
          <Button onClick={() => router.push('/auth/verification')}>
            Resend Email
          </Button>
        </Box>
      ) : (
        <Box>
          <Text>Email successfully verified redirecting you back.</Text>
        </Box>
      )}
    </Container>
  );
}
