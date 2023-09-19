'use client';
import { Box, Group } from '@mantine/core';
import { Section } from '@megp/core-fe';
import Link from 'next/link';

export default function GroupPage() {
  return (
    <Section title="New">
      <Group>
        <Link href="/groups">list</Link>
        <Link href="/groups/detail"> Detail</Link>
      </Group>
      <div>Detail form</div>
    </Section>
  );
}
