'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useListQuery } from './_api/mandate.api';
import { Mandate } from '@/models/mandate';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const { data: list, isLoading } = useListQuery();

  useEffect;
  const config: EntityConfig<Mandate> = useMemo(() => {
    return {
      basePath: '/mandate',
      mode: 'list',
      entity: 'mandate',
      primaryKey: 'id',
      title: 'Mandates',

      onDetail: (selected: Mandate) => {
        route.push(`/mandate/${selected?.id}`);
      },
      hasAdd: false,
      hasDetail: true,
      pagination: true,
      searchable: true,
      // onSearch: (search) => {
      //   // console.log('search', search);
      // },

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
          meta: {
            widget: 'expand',
          },
        },
      ],
    };
  }, [route]);

  const mode =
    pathname === `/mandate`
      ? 'list'
      : pathname === `/mandate/new`
      ? 'new'
      : 'detail';

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={list ? list.items : []}
      detail={children}
      isLoading={isLoading}
    />
  );
}
