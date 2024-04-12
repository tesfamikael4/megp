'use client';
import { EntityConfig, CollectionQuery, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/organizations.api';
import { logger } from '@megp/core-fe';
import { Organization } from '@/models/organization';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();

  const config: EntityConfig<Organization> = useMemo(() => {
    return {
      basePath: '/organizations',
      mode: 'list',
      entity: 'organizations',
      primaryKey: 'id',
      title: 'Organizations',
      hasAdd: false,
      searchable: true,
      pagination: true,
      sortable: true,
      onDetail: (selected: Organization) => {
        route.push(`/organizations/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/organizations/new`);
      },

      onSearch: (search) => {
        logger.log('search', search);
      },

      columns: [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'multiline',
          },
        },
        {
          id: 'shortName',
          header: 'Short Name',
          accessorKey: 'shortName',
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
    pathname === `/organizations`
      ? 'list'
      : pathname === `/organizations/new`
        ? 'new'
        : 'detail';

  const onRequestChange = (request: CollectionQuery) => {
    request?.where?.push([
      {
        column: 'type',
        value: 'BACK-OFFICE',
        operator: '=',
      },
    ]);
    trigger(request);
  };
  return (
    <>
      <EntityLayout
        mode={mode}
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        detail={children}
        onRequestChange={onRequestChange}
      />
    </>
  );
}
