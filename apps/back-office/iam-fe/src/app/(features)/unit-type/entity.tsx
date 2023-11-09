'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useListByIdQuery } from './_api/unit-type.api';
import { UnitType } from '@/models/unit-type';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const { data: list, isLoading } = useListByIdQuery();

  useEffect;
  const config: EntityConfig<UnitType> = useMemo(() => {
    return {
      basePath: '/unit-type',
      mode: 'list',
      entity: 'unit-type',
      primaryKey: 'id',
      title: 'Unit type',
      onAdd: () => {
        route.push(`/unit-type/new`);
      },
      onDetail: (selected: UnitType) => {
        route.push(`/unit-type/${selected?.id}`);
      },
      pagination: true,
      searchable: true,
      sortable: true,

      onSearch: (search) => {
        // console.log('search', search);
      },

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
    pathname === `/unit-type`
      ? 'list'
      : pathname === `/unit-type/new`
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
