'use client';

import { Box } from '@mantine/core';
import { WorkflowHandling } from '../../planning-approval/workflow';
import { useParams } from 'next/navigation';

export const WorkFlowLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  return (
    <Box>
      <Box className="mb-2">{children}</Box>
      <WorkflowHandling
        itemId={id as string}
        itemKey={'procurementrequisition'}
      />
    </Box>
  );
};
