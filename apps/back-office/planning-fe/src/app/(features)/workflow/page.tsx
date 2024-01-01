'use client';
import { Section } from '@megp/core-fe';
import { Steps } from './_components/workflow-designer';
import { Stack } from '@mantine/core';

export default function WorkflowPage() {
  return (
    <Stack>
      <Section title="A1" subTitle="Steps" defaultCollapsed>
        <Steps />
      </Section>
      <Section title="A2" subTitle="Steps" defaultCollapsed>
        <Steps />
      </Section>
    </Stack>
  );
}
