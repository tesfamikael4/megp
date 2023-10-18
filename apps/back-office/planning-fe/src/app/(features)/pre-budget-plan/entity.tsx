'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { PreBudgetPlan } from '@/models/pre-budget-plan';
import { useListQuery } from './_api/pre-budget-plan.api';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [data, setData] = useState<PreBudgetPlan[]>([]);
  const { data: list, isSuccess } = useListQuery();

  useEffect(() => {
    if (isSuccess) {
      setData(
        list.items.map((item: PreBudgetPlan) => {
          return { ...item };
        }),
      );
    }
  }, [isSuccess, list?.items]);

  const config: EntityConfig<PreBudgetPlan> = useMemo(() => {
    return {
      basePath: '/pre-budget-plan',
      mode: 'list',
      entity: 'pre-budget-plan',
      primaryKey: 'description',
      title: 'Prebudget Plan',
      onAdd: () => {
        route.push(`/pre-budget-plan/new`);
      },
      onDetail: (selected: PreBudgetPlan) => {
        route.push(`/pre-budget-plan/${selected.id}`);
      },

      selectable: true,
      columns: [
        {
          id: 'name',
          header: 'Desrciption',
          accessorKey: 'description',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'remark',
          header: 'Remark',
          accessorKey: 'remark',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'multiline',
          },
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname === `/pre-budget-plan`
      ? 'list'
      : pathname === `/pre-budget-plan/new`
      ? 'new'
      : 'detail';

  return (
    <EntityLayout mode={mode} config={config} data={data} detail={children} />
  );
}
