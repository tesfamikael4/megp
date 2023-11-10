'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { useMemo } from 'react';
import { PreBudgetPlanActivities } from '@/models/pre-budget-plan-activities';
import { useGetPreBudgetPlansQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { useRouter } from 'next/navigation';

export function Entity({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: list } = useGetPreBudgetPlansQuery({} as any);

  const config: EntityConfig<any> = useMemo(() => {
    return {
      basePath: `/app`,
      mode: 'list',
      entity: 'Budget year',
      primaryKey: 'name',
      title: ' Budget Years',
      hasAdd: false,
      onDetail: (selected: PreBudgetPlanActivities) => {
        router.push(`/pre-budget-plan/${selected.id}/activities`);
      },
      columns: [
        {
          id: 'budgetYear',
          header: 'Budget Year',
          accessorKey: 'app.budgetYear',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'name',
          header: 'Plan Name',
          accessorKey: 'app.planName',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'description',
          header: 'Description',
          accessorKey: 'app.description',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
      ],
    };
  }, [router]);
  return (
    <EntityLayout
      mode={'list'}
      config={config}
      data={list?.items ?? []}
      detail={children}
    />
  );
}
