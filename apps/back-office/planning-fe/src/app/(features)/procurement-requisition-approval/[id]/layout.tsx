'use client';

import { Box, Flex } from '@mantine/core';
import { WorkflowHandling } from '@/app/(features)/planning-approval/workflow';
import { useParams } from 'next/navigation';
export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  return (
    <Flex gap="md">
      <Box className="w-3/5">{children}</Box>
      <Box className="w-2/5">
        <WorkflowHandling
          itemId={id as string}
          itemKey={'procurementRequisitionApproval'}
        />
      </Box>
    </Flex>
  );
}
