'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
export default function ItemCategoryPage() {
  return (
    <Section title="New item-category" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
