'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { logger } from '@megp/core-fe';
import { useListQuery } from '../../_api/app.api';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const { data: list } = useListQuery({} as any);

  const config: EntityConfig<any> = useMemo(() => {
    return {
      basePath: '/budget',
      mode: 'list',
      entity: 'budget',
      primaryKey: 'name',
      title: 'Budget',
      hasAdd: false,
      onDetail: (selected: any) => {
        route.push(`/budget/${selected.id}`);
      },
      pagination: true,
      sortable: true,
      onSearch: (search) => {
        logger.log('search', search);
      },

      columns: [
        {
          id: 'name',
          header: 'Budget Year',
          accessorKey: 'budgetYear',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'startDate',
          header: 'Start Date',
          accessorKey: 'startDate',
          cell: ({ row: { original } }: any) => `Jan 1, ${original.budgetYear}`,
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'endDate',
          header: 'End Date',
          accessorKey: 'endDate',
          cell: ({ row: { original } }: any) =>
            `Dec 30, ${original.budgetYear}`,
          meta: {
            widget: 'expand',
          },
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname === `/budget`
      ? 'list'
      : pathname === `/budget/new`
      ? 'new'
      : 'detail';

  return (
    <>
      <EntityLayout
        mode={mode}
        config={config}
        data={list?.items ?? []}
        detail={children}
      />
    </>
  );
}
