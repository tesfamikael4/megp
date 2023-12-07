import { Box } from '@mantine/core';
import { PlanYearTab } from '../../../_components/plan-year-tab';
import { Entity } from './entity';
export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <PlanYearTab page="pre" />
      <Entity>{children}</Entity>
    </Box>
  );
}
