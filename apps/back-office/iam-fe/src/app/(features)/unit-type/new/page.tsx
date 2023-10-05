'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function UnitTypePage() {
  return (
    <Section title="New Unit Type" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
