'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useListByIdQuery } from './_api/budget-category.api';
import { BudgetCategory } from '@/models/budget-category';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const { isLoading } = useListByIdQuery();

  useEffect;
  const config: EntityConfig<BudgetCategory> = useMemo(() => {
    return {
      basePath: '/lookup/budget-category',
      mode: 'list',
      entity: 'Budget Category',
      primaryKey: 'id',
      title: 'Budget Category',
      onAdd: () => {
        route.push(`/lookup/budget-category/new`);
      },
      onDetail: (selected: BudgetCategory) => {
        route.push(`/lookup/budget-category/${selected?.id}`);
      },

      searchable: true,
      pagination: true,
      sortable: true,

      columns: [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },

        {
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);
  const data = [
    {
      id: '607d37b5-f303-44ea-bf7e-f67fa3d64b4b',
      name: 'Budget Category 1',
      description: 'Budget Category 1',
    },
    {
      id: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      name: 'Budget Category 1',
      description: 'Procurement Method 1',
    },
    {
      id: '15272d4f-d78f-4c58-8e93-ff436a815219',
      name: 'Budget Category 1',
      description: 'Budget Category 1',
    },
  ];

  const mode =
    pathname === `/lookup/budget-category`
      ? 'list'
      : pathname === `/lookup/budget-category/new`
      ? 'new'
      : 'detail';

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={data}
      detail={children}
      isLoading={isLoading}
    />
  );
}
