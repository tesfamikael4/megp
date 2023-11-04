'use client';
import React from 'react';
import { Text } from '@mantine/core';
import ChangeSecurity from './change-security';

export default function SetSecurity(): JSX.Element {
  return (
    <div>
      <Text className="font-semibold">
        Please set the below security questions before proceeding.
      </Text>
      <ChangeSecurity mode="new" />
    </div>
  );
}
