'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
export default function NewTagPage() {
  return (
    <Section title="New Item Tag" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
