'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function RolePage() {
  return (
    <Section title="New Role" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
