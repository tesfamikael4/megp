'use client';
import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddPermission from '../_components/permission';

export default function ApplicationDetailPage() {
  return (
    <Stack>
      <Section title="Application Detail">
        <FormDetail mode="detail" />
      </Section>
      <AddPermission />
    </Stack>
  );
}
