'use client';
import { Section } from '@megp/core-fe';
import { Steps } from './_components/workflow-designer';
import { Skeleton, Stack } from '@mantine/core';
// import { useGetActivitiesQuery } from '@/store/api/workflow/workflow.api';
import { useListQuery } from '@/app/(features)/procurement-requisition/_api/procurement-requisition.api';

export default function WorkflowPage() {
  const { data: requisition } = useListQuery({});
  if (!requisition)
    return (
      <>
        <Skeleton height={400} width="100%" />
        <Skeleton height={400} width="100%" />
        <Skeleton height={400} width="100%" />
        <Skeleton height={400} width="100%" />
      </>
    );
  return (
    <Stack>
      {requisition?.items.map((e, index) => (
        <Section key={index} title={e.title} subTitle="Steps" defaultCollapsed>
          <Steps activityId={e.id} />
        </Section>
      ))}
      {/* <Section title="A1" subTitle="Steps" defaultCollapsed>
        <Steps />
      </Section>
      <Section title="A2" subTitle="Steps" defaultCollapsed>
        <Steps />
      </Section> */}
    </Stack>
  );
}
