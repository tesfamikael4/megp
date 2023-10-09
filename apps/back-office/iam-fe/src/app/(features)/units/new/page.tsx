'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function UnitPage() {
  return (
    <Section title="New Unit" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
