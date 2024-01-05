'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { BudgetCategory } from '@/models/budget-category';
import { logger } from '@megp/core-fe';
import { useLazyListQuery } from './_api/budget-category.api';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();
  const pathname = usePathname();

  useEffect;
  const config: EntityConfig<BudgetCategory> = useMemo(() => {
    return {
      basePath: '/lookup/budget-category',
      mode: 'list',
      entity: 'budget-categories',
      primaryKey: 'id',
      title: 'Budget Category',
      onAdd: () => {
        route.push(`/lookup/budget-category/new`);
      },
      onDetail: (selected: BudgetCategory) => {
        route.push(`/lookup/budget-category/${selected?.id}`);
      },

      onSearch: (search) => {
        logger.log('search', search);
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

  const mode =
    pathname === `/lookup/budget-category`
      ? 'list'
      : pathname === `/lookup/budget-category/new`
      ? 'new'
      : 'detail';

  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={data?.items ?? []}
      total={data?.total ?? 0}
      onRequestChange={onRequestChange}
      detail={children}
    />
  );
}
