'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/organization-type.api';
import { OrganizationType } from '@/models/organization-type';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListQuery();

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
      pagination: true,
      searchable: true,
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
    pathname === `/organization-type`
      ? 'list'
      : pathname === `/organization-type/new`
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
