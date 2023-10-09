'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function OrganizationSectorPage() {
  return (
    <Section title="New Organization sector" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
