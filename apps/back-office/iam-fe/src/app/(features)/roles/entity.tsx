'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useListByIdQuery } from './_api/role.api';
import { Role } from '@/models/role';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const { data: list, isLoading } = useListByIdQuery();

  useEffect;
  const config: EntityConfig<Role> = useMemo(() => {
    return {
      basePath: '/roles',
      mode: 'list',
      entity: 'Role',
      primaryKey: 'id',
      title: 'Roles',
      onAdd: () => {
        route.push(`/roles/new`);
      },
      onDetail: (selected: Role) => {
        route.push(`/roles/${selected?.id}`);
      },

      onSearch: (search) => {
        // console.log('search', search);
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
    pathname === `/roles`
      ? 'list'
      : pathname === `/roles/new`
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
