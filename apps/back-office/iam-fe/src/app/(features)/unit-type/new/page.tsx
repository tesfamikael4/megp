'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function UnitTypePage() {
  return (
    <Section title="New unit type" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
