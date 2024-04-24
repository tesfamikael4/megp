'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
export default function NewMeasurementPage() {
  return (
    <Section title="New Measurement" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
