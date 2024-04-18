import PlanningTab from '../../../_components/planning-tab';

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PlanningTab page="post" />
      {children}
    </>
  );
}
