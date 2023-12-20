'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
export default function CurrencyPage() {
  return (
    <Section title="New Region" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
