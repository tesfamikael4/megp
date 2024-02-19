import { WorkFlowLayout } from './workflow-layout';

export default function PreBudgetPlanLayout({
  children,
  }: {
    children: React.ReactNode;
    }) {
      return <WorkFlowLayout>{children}</WorkFlowLayout>;
      }
