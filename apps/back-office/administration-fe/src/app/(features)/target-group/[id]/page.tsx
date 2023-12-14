'use client';
import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
export default function TargetGroupPage() {
  return (
    <Stack>
      <Section title="Target Group Detail">
        <FormDetail mode="detail" />
      </Section>
    </Stack>
  );
}
