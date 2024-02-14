'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function SpdPage() {
  return (
    <Section title="New Standard Procurement Document" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
