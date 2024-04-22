'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
export default function ItemSubCategoryPage() {
  return (
    <Section title="New Item Sub Category" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
