'use client';
import { useEffect, useState } from 'react';
import { sendVerificationEmail } from 'supertokens-web-js/recipe/emailverification';
import { Button, Container, Paper, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Image from 'next/image';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function Verification() {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    sendEmail();
  }, []);

  async function sendEmail() {
    try {
      setLoading(true);
      let response = await sendVerificationEmail();
      if (response.status === 'EMAIL_ALREADY_VERIFIED_ERROR') {
        // This can happen if the info about email verification in the session was outdated.
        // Redirect the user to the home page
        setResponse(response.status);
      } else {
        // email was sent successfully.
        setResponse(
          'We have sent you a verification link, please click on it to verify you email.',
        );
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
          message: 'Oops! Something went wrong.',
          color: 'red',
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Container className="md:w-2/5 p-4">
        <Paper withBorder className="text-center pt-4 pb-4 rounded-md">
          <Image
            src="/email.svg"
            height={400}
            width={300}
            alt="email"
            className="mx-auto"
          />
          <Title>Email Verification</Title>
          <LoadingOverlay visible={loading} />
          {response === 'EMAIL_ALREADY_VERIFIED_ERROR' && loading === false ? (
            <>
              <Text className="mt-8">
                This email has already been verified!
              </Text>
              <Button
                className="mt-10"
                onClick={() => router.push('/auth/login')}
              >
                Login
              </Button>
            </>
          ) : (
            <Text size={'lg'} className="mt-10">
              {response}
            </Text>
          )}
        </Paper>
      </Container>
    </>
  );
}
