'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useListQuery } from './_api/my-mandate.api';
import { Mandate } from '@/models/mandate';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const { data: list } = useListQuery();

  useEffect;
  const config: EntityConfig<Mandate> = useMemo(() => {
    return {
      basePath: '/my-mandate',
      mode: 'list',
      entity: 'my-mandate',
      primaryKey: 'id',
      title: 'My Mandates',
      // onAdd: () => {
      //   route.push(`/my-mandate/new`);
      // },
      onDetail: (selected: Mandate) => {
        route.push(`/my-mandate/${selected?.id}`);
      },

      onSearch: (search) => {
        // console.log('search', search);
      },
      selectable: true,
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
            widget: 'multiline',
          },
        },
      ],
    };
  }, [route]);

  const mode =
    pathname === `/my-mandate`
      ? 'list'
      : pathname === `/my-mandate/new`
      ? 'new'
      : 'detail';

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={list ? list.items : []}
      detail={children}
    />
  );
}
