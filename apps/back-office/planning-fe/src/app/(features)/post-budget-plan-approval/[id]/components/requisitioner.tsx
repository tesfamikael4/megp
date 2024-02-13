import { useLazyGetPostBudgetRequisitionerQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';
import { Table, TableConfig } from '@megp/core-fe';
import { useEffect } from 'react';

const config: TableConfig<any> = {
  columns: [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
    },
  ],
};

export const Requisitioner = ({ activityId }: { activityId: string }) => {
  const [getRequisitioner, { data }] = useLazyGetPostBudgetRequisitionerQuery();

  useEffect(() => {
    getRequisitioner(activityId);
  }, []);
  return <Table data={data?.items ?? []} config={config} />;
};
