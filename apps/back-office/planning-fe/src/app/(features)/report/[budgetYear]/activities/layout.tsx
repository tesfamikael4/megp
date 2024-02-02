import { Box } from '@mantine/core';
import ReportTab from '../../_components/report-tab';
export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <ReportTab />
      {children}
    </Box>
  );
}
