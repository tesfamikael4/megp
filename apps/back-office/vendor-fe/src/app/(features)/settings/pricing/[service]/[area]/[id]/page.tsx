'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function GroupPage() {
  return (
    <Section title="Price Detail" collapsible={true}>
      <FormDetail mode="detail" />
    </Section>
  );
}
