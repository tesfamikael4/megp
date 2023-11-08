'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddPermission from '../_components/mandate-permission.api';
import { Stack } from '@mantine/core';

export default function MyMandatePage() {
  return (
    <Stack>
      <Section title="Mandate detail">
        <FormDetail />
      </Section>
      <AddPermission />
    </Stack>
  );
}
