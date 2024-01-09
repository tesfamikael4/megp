import { Box } from '@mantine/core';
import { Entity } from './entity';
import PlanningTab from '@/app/(features)/_components/planning-tab';

export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <PlanningTab page="post" />
      <Entity>{children}</Entity>
    </Box>
  );
}
