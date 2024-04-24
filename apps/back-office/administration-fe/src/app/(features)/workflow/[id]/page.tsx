'use client';
import { Section } from '@megp/core-fe';
import { Stack } from '@mantine/core';
import { Permissions } from '../_components/permissions';
import { Designer } from '../_components/workflow-designer';
import { usePathname, useRouter } from 'next/navigation';

export default function WorkflowDetailPage() {
  return (
    <Stack>
      <Section title="Default steps" defaultCollapsed>
        <Designer />
      </Section>
      <Section title="Default permissions" defaultCollapsed>
        <Permissions />
      </Section>
    </Stack>
  );
}
