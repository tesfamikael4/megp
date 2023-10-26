'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useListQuery } from './_api/organization-type.api';
import { OrganizationType } from '@/models/organization-type';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const { data: list } = useListQuery();

  useEffect;
  const config: EntityConfig<OrganizationType> = useMemo(() => {
    return {
      basePath: '/organization-type',
      mode: 'list',
      entity: 'organization-type',
      primaryKey: 'id',
      title: 'Organization Type',
      onAdd: () => {
        route.push(`/organization-type/new`);
      },
      onDetail: (selected: OrganizationType) => {
        route.push(`/organization-type/${selected?.id}`);
      },

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
            widget: 'multiline',
          },
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
    />
  );
}
