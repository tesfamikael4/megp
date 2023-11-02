'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Box, Button, Container, Text } from '@mantine/core';
import { LoadingOverlay } from '@mantine/core';
import { useAuth } from '@megp/core-fe/src/context/auth.context';

export default function ConsumeVerification() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { verify } = useAuth();

  useEffect(() => {
    consumeVerificationCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function consumeVerificationCode() {
    try {
      setLoading(true);
      const response = await verify({
        verificationId: '',
        otp: '',
        isOtp: true,
      });
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
