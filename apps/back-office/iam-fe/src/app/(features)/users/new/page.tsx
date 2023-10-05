'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function UserNewPage() {
  return (
    <Section title="New User" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
