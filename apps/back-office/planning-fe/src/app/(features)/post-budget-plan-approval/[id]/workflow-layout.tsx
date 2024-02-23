'use client';

import { Box, Flex } from '@mantine/core';
import { WorkflowHandling } from '../../planning-approval/workflow';
import { useParams } from 'next/navigation';

export const WorkFlowLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  return (
    <Flex gap="md">
      <Box className="w-3/5">{children}</Box>
      <Box className="w-2/5">
        <WorkflowHandling itemId={id as string} itemKey="postBudgetApproval" />
      </Box>
    </Flex>
  );
};
