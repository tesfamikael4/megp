'use client';
import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
export default function CurrencyPage() {
  return (
    <Stack>
      <Section title="District Detail">
        <FormDetail mode="detail" />
      </Section>
    </Stack>
  );
}
