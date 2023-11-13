'use client';
import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
export default function ItemCategoryPage() {
  return (
    <Stack>
      <Section title="Item Category Detail">
        <FormDetail mode="detail" />
      </Section>
    </Stack>
  );
}
