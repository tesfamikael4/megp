'use client';
import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddUnit from '../_components/measurement-unit-relation';
export default function MeasurementPage() {
  return (
    <Stack>
      <Section title="Measurement Detail">
        <FormDetail mode="detail" />
      </Section>
      <AddUnit />
    </Stack>
  );
}
