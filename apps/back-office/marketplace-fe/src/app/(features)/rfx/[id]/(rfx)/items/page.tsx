'use client';

import { Section } from '@megp/core-fe';
import { Items } from '../../../_components/item/items';

export default function ItemsPage() {
  return (
    <Section title="Items" collapsible={false}>
      <Items />
    </Section>
  );
}
