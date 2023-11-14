'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useListByIdQuery } from './_api/unit.api';
import { Unit } from '@/models/unit';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [data, setData] = useState<Unit[]>([]);

  const { data: list, isSuccess, isLoading } = useListByIdQuery();

  useEffect(() => {
    if (isSuccess) {
      setData(
        list.items.map((item: Unit) => {
          return { ...item, isActive: item.isActive ? 'Active' : 'Inactive ' };
        }),
      );
    }
  }, [isSuccess, list?.items]);

  const config: EntityConfig<Unit> = useMemo(() => {
    return {
      basePath: '/units',
      mode: 'list',
      entity: 'units',
      primaryKey: 'id',
      title: 'Units',
      onAdd: () => {
        route.push(`/units/new`);
      },
      onDetail: (selected: Unit) => {
        route.push(`/units/${selected?.id}`);
      },
      pagination: true,
      searchable: true,
      sortable: true,
      // selectable: true,
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
          meta: {
            widget: 'expand',
          },
        },

        {
          id: 'isActive',
          header: 'Active',
          accessorKey: 'isActive',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
      ],
    };
  }, [route]);

  const mode =
    pathname === `/units`
      ? 'list'
      : pathname === `/units/new`
      ? 'new'
      : 'detail';

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={data}
      detail={children}
      hasTree={true}
      isLoading={isLoading}
    />
  );
}
