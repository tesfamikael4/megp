import { useLazyGetPreBudgetTimelineQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
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
      cell: ({ getValue, row, column }) => (
        <Period getValue={getValue} row={row} column={column} />
      ),
    },
    {
      id: 'date',
      header: 'Due Date',
      accessorKey: 'dueDate',
      cell: ({ getValue, row, column }) => (
        <DueDate getValue={getValue} row={row} column={column} />
      ),
    },
  ],
};

const Period = ({ getValue, row: { index } }: any) => {
  const initialValue = getValue();
  return (
    <>
      {index == 0 ? (
        <TextInput rightSection="Days" disabled value="NA" />
      ) : (
        <TextInput value={initialValue} rightSection="Days" disabled />
      )}
    </>
  );
};

const DueDate = ({ getValue, row: { index }, column: { id } }: any) => {
  const initialValue = getValue();
  return (
    <>
      <DateInput
        valueFormat="DD-MMM-YYYY"
        value={new Date(initialValue)}
        placeholder="Pick date"
        disabled
      />
    </>
  );
};

export const Timeline = ({ activityId }: { activityId: string }) => {
  const [getTimeline, { data }] = useLazyGetPreBudgetTimelineQuery();

  useEffect(() => {
    getTimeline(activityId);
  }, []);
  return <Table config={listConfig} data={data?.items ?? []} />;
};
