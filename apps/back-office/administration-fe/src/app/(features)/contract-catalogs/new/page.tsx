'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
export default function ContractPage() {
  return (
    <Section title="New Contract Catalog" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
