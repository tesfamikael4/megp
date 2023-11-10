import { Box } from '@mantine/core';
import { PlanYearTab } from './_components/plan-year-tab';

export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <PlanYearTab />
      {children}
    </Box>
  );
}
