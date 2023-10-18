'use client';
import { Section } from '@megp/core-fe';
import { ItemForm } from '../_components/item-form';

export default function ItemPage() {
  return (
    <>
      <Section title="Item Detail">
        <ItemForm mode="detail" />
      </Section>
    </>
  );
}
