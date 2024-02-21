import { useLazyGetPreBudgetTimelineQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';

import { DataTable } from 'mantine-datatable';
import { useEffect } from 'react';

export const Timeline = ({ activityId }: { activityId: string }) => {
  const [getTimeline, { data }] = useLazyGetPreBudgetTimelineQuery();

  useEffect(() => {
    getTimeline(activityId);
  }, []);
  return (
    <DataTable
      records={data?.items ?? []}
      columns={[
        { accessor: 'timeline', title: 'Name' },
        { accessor: 'period', width: 200 },
        {
          accessor: 'dueDate',
          render: (record) => (
            <p>
              {new Date(record.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          ),
        },
      ]}
      withTableBorder
      withColumnBorders
      striped
      noRecordsText="No Found"
      highlightOnHover
      minHeight={200}
    />
  );
};
