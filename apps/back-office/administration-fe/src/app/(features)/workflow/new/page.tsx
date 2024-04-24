'use client';
import { Section } from '@megp/core-fe';
import FormDetail from '../_components/form-detail';

export default function NewWorkflowPage() {
  return (
    <Section title="New" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
