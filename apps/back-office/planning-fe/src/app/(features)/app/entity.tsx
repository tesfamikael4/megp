'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { PreBudgetPlanActivities } from '@/models/pre-budget-plan-activities';
import { useListQuery } from './_api/app.api';

export function Entity({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: list } = useListQuery();

  const config: EntityConfig<any> = useMemo(() => {
    return {
      basePath: `/app`,
      mode: 'list',
      entity: 'annual-procurement-plan',
      primaryKey: 'name',
      title: 'Annual Procurement Plan',
      onAdd: () => {
        router.push(`/app/new`);
      },
      onDetail: (selected: PreBudgetPlanActivities) => {
        router.push(`/app/${selected.id}`);
      },
      columns: [
        {
          id: 'name',
          header: 'Plan Name',
          accessorKey: 'planName',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'budgetYear',
          header: 'Budget Year',
          accessorKey: 'budgetYear',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
      ],
    };
  }, [router]);

  const pathname = usePathname();

  const mode =
    pathname === `/app` ? 'list' : pathname === `/app/new` ? 'new' : 'detail';

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={list?.items ?? []}
      detail={children}
    />
  );
}
