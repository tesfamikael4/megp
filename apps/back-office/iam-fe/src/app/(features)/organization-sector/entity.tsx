'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useListQuery } from './_api/organization-sector.api';
import { OrganizationSector } from '@/models/organization-sector';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const { data: list } = useListQuery();

  useEffect;
  const config: EntityConfig<OrganizationSector> = useMemo(() => {
    return {
      basePath: '/organization-sector',
      mode: 'list',
      entity: 'organization-sector',
      primaryKey: 'id',
      title: 'Organization Sector',
      onAdd: () => {
        route.push(`/organization-sector/new`);
      },
      onDetail: (selected: OrganizationSector) => {
        route.push(`/organization-sector/${selected?.id}`);
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
    pathname === `/organization-sector`
      ? 'list'
      : pathname === `/organization-sector/new`
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
