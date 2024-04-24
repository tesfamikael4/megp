'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
export default function NewProcurementThresholdsPage() {
  return (
    <Section title="New Threshold" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
