'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function ItemMasterDetailPage() {
  return (
    <Section title="Item Master Detail" collapsible={true}>
      <FormDetail mode="detail" />
    </Section>
  );
}
