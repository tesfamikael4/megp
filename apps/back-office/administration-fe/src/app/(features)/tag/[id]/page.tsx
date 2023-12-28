'use client';
import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
export default function TagPage() {
  return (
    <Stack>
      <Section title="Tag Detail">
        <FormDetail mode="detail" />
      </Section>
    </Stack>
  );
}
