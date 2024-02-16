import { Box } from '@mantine/core';
import PlanningTab from '@/app/(features)/(app)/_components/planning-tab';

export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <PlanningTab page="post" />
      {/* <Entity>{children}</Entity> */}
      {children}
    </Box>
  );
}
