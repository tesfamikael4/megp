'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/role.api';
import { Role } from '@/models/role';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListQuery();

  const config: EntityConfig<Role> = useMemo(() => {
    return {
      basePath: '/system-role',
      mode: 'list',
      entity: 'system-roles',
      primaryKey: 'id',
      title: 'System roles',

      onDetail: (selected: Role) => {
        route.push(`/system-role/${selected?.id}`);
      },

      searchable: true,
      pagination: true,
      sortable: true,
      hasAdd: false,

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
    pathname === `/system-role`
      ? 'list'
      : pathname === `/system-role/new`
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
      detail={children}
      isLoading={isFetching}
      onRequestChange={onRequestChange}
    />
  );
}
