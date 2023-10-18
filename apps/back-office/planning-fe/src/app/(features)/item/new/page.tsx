'use client';

import { Section } from '@megp/core-fe';
import { ItemForm } from '../../item/_components/item-form';

export default function ItemPage() {
  return (
    <Section title="New Item" collapsible={false}>
      <ItemForm mode="new" />
    </Section>
  );
}
