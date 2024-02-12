import { Box, Flex } from '@mantine/core';
import WorkflowHandling from '../../planning-approval/page';
export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex gap="md">
      <Box className="w-3/5">{children}</Box>
      <Box className="w-2/5">
        <WorkflowHandling activityId="1f344819-d64d-4986-b192-ee06f5bf0e98" />
      </Box>
    </Flex>
  );
}
