'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function OrganizationPage() {
  return (
    <Section title="New Organization" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
