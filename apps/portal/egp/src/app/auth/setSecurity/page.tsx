'use client';
import React from 'react';
import { Container, Text } from '@mantine/core';
import ChangeSecurity from '@/app/(features)/my/security/changeSecurity';
import { notifications } from '@mantine/notifications';

export default function SetSecurity() {
  return (
    <Container className="min-w-[40vw] rounded-sm shadow-md p-4">
      <Text className="font-semibold">
        Please set the below security questions before proceeding.
      </Text>
      <ChangeSecurity mode="new" />
    </Container>
  );
}
