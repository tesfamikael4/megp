'use client';
import { Container, Paper, Text, Title } from '@mantine/core';
import Image from 'next/image';

export default function Verification() {
  return (
    <Container className="md:w-2/5 p-4">
      <Paper withBorder className="text-center pt-4 pb-4 rounded-md">
        <Image
          src="/email.svg"
          height={400}
          width={300}
          alt="email"
          className="mx-auto"
        />
        <Title>Verify Your Email</Title>
        <Text size={'lg'} className="mt-10">
          We have sent you a verification link, please click on it to verify
          your email.
        </Text>
      </Paper>
    </Container>
  );
}
