import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import React from 'react';
import ItemCatalogue from './item-catalogue';
import { Item } from '@/models/tender/item';

export default function SOR({ item }: { item: Item }) {
  return (
    <Stack className="w-full">
      <Section title="Specification" collapsible={false}>
        <ItemCatalogue />
      </Section>
    </Stack>
  );
}
