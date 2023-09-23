'use client';
import { Box, Group } from '@mantine/core';
import { Section } from '@megp/core-fe';
import Link from 'next/link';

export default function GroupPage() {
  return (
    <div className="min-w-[800px] min-h-screen">
      <Group>
        <Link href="/groups">list</Link>
        <Link href="/groups/123">group Detail</Link>
      </Group>
      <div>New form</div>
    </div>
  );
}
