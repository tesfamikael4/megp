import { Box, Flex } from '@mantine/core';
import WorkflowHandling from '../planning-approval/workflow';
export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex gap="md">
      <Box className="w-3/5">{children}</Box>
      <Box className="w-2/5">
        <WorkflowHandling />
      </Box>
    </Flex>
  );
}
