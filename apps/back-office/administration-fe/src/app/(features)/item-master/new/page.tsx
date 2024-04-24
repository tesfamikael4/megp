'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function NewItemMasterPage() {
  return (
    <Section title="New Item Master" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
