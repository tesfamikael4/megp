'use client';
import { Group } from '@mantine/core';
import { Section } from '@megp/core-fe';
import Link from 'next/link';
import { FormDetail } from '../_components/form-detail';

export default function GroupPage() {
  return (
    <Section title="New Group" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
