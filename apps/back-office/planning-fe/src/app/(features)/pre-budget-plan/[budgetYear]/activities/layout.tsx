import { Box } from '@mantine/core';
import PlanningTab from '@/app/(features)/_components/planning-tab';
export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <PlanningTab page="pre" />
      {children}
    </Box>
  );
}
