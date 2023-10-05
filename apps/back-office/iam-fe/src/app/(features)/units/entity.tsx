'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useListQuery } from './_api/unit.api';
import { Unit } from '@/models/unit';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [data, setData] = useState<Unit[]>([]);

  const { data: list, isSuccess } = useListQuery();

  useEffect(() => {
    if (isSuccess) {
      setData(
        list.items.map((item: Unit) => {
          return { ...item, isActive: item.isActive ? 'Yes' : 'No ' };
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
        {
          id: 'code',
          header: 'Code',
          accessorKey: 'code',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'multiline',
          },
        },

        {
          id: 'isActive',
          header: 'Active',
          accessorKey: 'isActive',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'multiline',
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
    <EntityLayout mode={mode} config={config} data={data} detail={children} />
  );
}
