'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { logger } from '@megp/core-fe';
import { DateInput } from '@mantine/dates';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();

  const items = [
    {
      id: '1',
      budgetYear: '2016',
      startDate: 'Jan 11, 2016',
      endDate: 'Dec 11, 2016',
    },
    {
      id: '2',
      budgetYear: '2017',
      startDate: 'Jan 11, 2017',
      endDate: 'Dec 11, 2017',
    },
    {
      id: '3',
      budgetYear: '2018',
      startDate: 'Jan 11, 2018',
      endDate: 'Dec 11, 2018',
    },
    {
      id: '4',
      budgetYear: '2019',
      startDate: 'Jan 11, 2019',
      endDate: 'Dec 11, 2019',
    },
    {
      id: '5',
      budgetYear: '2020',
      startDate: 'Jan 11, 2020',
      endDate: 'Dec 11, 2020',
    },
    {
      id: '6',
      budgetYear: '2021',
      startDate: 'Jan 11, 2021',
      endDate: 'Dec 11, 2021',
    },
    {
      id: '7',
      budgetYear: '2022',
      startDate: 'Jan 11, 2022',
      endDate: 'Dec 11, 2022',
    },
  ];

  const config: EntityConfig<any> = useMemo(() => {
    return {
      basePath: '/budget',
      mode: 'list',
      entity: 'budget',
      primaryKey: 'name',
      title: 'Budget',
      hasAdd: false,
      onDetail: (selected: any) => {
        route.push(`/budget/${selected.budgetYear}`);
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
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'endDate',
          header: 'End Date',
          accessorKey: 'endDate',
          cell: (info) => info.getValue(),
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
        data={items ? items.reverse() : []}
        detail={children}
      />
    </>
  );
}
