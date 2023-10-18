'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Initiation } from '@/models/initiation';
import { useListQuery } from './_api/initiation.api';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [data, setData] = useState<Initiation[]>([]);
  const { data: list, isSuccess } = useListQuery();

  useEffect(() => {
    if (isSuccess) {
      setData(
        list.items.map((item: Initiation) => {
          return { ...item };
        }),
      );
    }
  }, [isSuccess, list?.items]);
  const config: EntityConfig<Initiation> = useMemo(() => {
    return {
      basePath: '/initiation',
      mode: 'list',
      entity: 'initiation',
      primaryKey: 'id',
      title: 'Plan Initiation',
      onAdd: () => {
        route.push(`/initiation/new`);
      },
      onDetail: (selected: Initiation) => {
        route.push(`/initiation/${selected.id}`);
      },

      selectable: true,
      columns: [
        {
          id: 'name',
          header: 'Plan Name',
          accessorKey: 'planName',
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
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
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
    pathname === `/initiation`
      ? 'list'
      : pathname === `/initiation/new`
      ? 'new'
      : 'detail';

  return (
    <EntityLayout mode={mode} config={config} data={data} detail={children} />
  );
}
