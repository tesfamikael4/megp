'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useListQuery } from './_api/organization-type.api';
import { OrganizationType } from '@/models/organization-type';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const { data: list, isLoading } = useListQuery({});

  const config: EntityConfig<OrganizationType> = useMemo(() => {
    return {
      basePath: '/organization-type',
      mode: 'list',
      entity: 'organization-type',
      primaryKey: 'id',
      title: 'Organization type',
      onAdd: () => {
        route.push(`/organization-type/new`);
      },
      onDetail: (selected: OrganizationType) => {
        route.push(`/organization-type/${selected?.id}`);
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
    pathname === `/organization-type`
      ? 'list'
      : pathname === `/organization-type/new`
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
