import { useLazyGetPreBudgetTimelineQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';

import { Table, TableConfig } from '@megp/core-fe';
import { useEffect } from 'react';

const listConfig: TableConfig<any> = {
  columns: [
    {
      header: 'Name',
      accessorKey: 'timeline',
    },
    {
      id: 'period',
      header: 'Period',
      accessorKey: 'period',
    },
    {
      id: 'date',
      header: 'Due Date',
      accessorKey: 'dueDate',
      cell: ({ row: { original } }) => (
        <p>
          {new Date(original.dueDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      ),
    },
  ],
};

export const Timeline = ({ activityId }: { activityId: string }) => {
  const [getTimeline, { data }] = useLazyGetPreBudgetTimelineQuery();

  useEffect(() => {
    getTimeline(activityId);
  }, []);
  return <Table config={listConfig} data={data?.items ?? []} />;
};
