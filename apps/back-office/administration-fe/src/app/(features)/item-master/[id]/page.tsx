'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import { Builder } from '../_components/table-builder';
import { Stack } from '@mantine/core';

export default function ItemMasterDetailPage() {
  return (
    <>
      <Stack>
        <Section title="Item MasterDetail" collapsible={true}>
          <FormDetail mode="detail" />
        </Section>

        <Section title="Specification Template" collapsible={true}>
          <Builder />
        </Section>
      </Stack>
    </>
  );
}
