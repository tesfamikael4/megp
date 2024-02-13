import { Box, Flex } from '@mantine/core';
import { WorkflowHandling } from '../planning-approval/workflow';
export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex gap="md">
      <Box className="w-3/5">{children}</Box>
      <Box className="w-2/5">
        <WorkflowHandling activityId="c076d2a2-22f8-47c0-9cd0-5b00154e8479" />
      </Box>
    </Flex>
  );
}
