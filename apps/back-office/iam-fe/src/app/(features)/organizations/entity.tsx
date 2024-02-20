'use client';
import { Organization } from '@/models/organization';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/organization.api';
import { Type } from './_components/organization-type';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListQuery();

  const config: EntityConfig<Organization> = useMemo(() => {
    return {
      basePath: '/organizations',
      mode: 'list',
      entity: 'organizations',
      primaryKey: 'id',
      title: 'Organization',
      onAdd: () => {
        route.push(`/organizations/new`);
      },
      onDetail: (selected: Organization) => {
        route.push(`/organizations/${selected?.id}`);
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
          id: 'shortName',
          header: 'Short Name',
          accessorKey: 'shortName',
          cell: (info) => info.getValue(),
        },

        {
          id: 'typeId',
          header: 'Organization type',
          accessorKey: 'typeId',
          cell: (info) => <Type id={info.row.original.typeId} />,
        },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

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
    <EntityLayout
      mode={mode}
      config={config}
      data={
        data?.items?.map((item: Organization) => {
          return {
            ...item,
            status: item.status === 'ACTIVE' ? 'Active' : 'Inactive ',
          };
        }) ?? []
      }
      total={data?.total ?? 0}
      detail={children}
      isLoading={isFetching}
      onRequestChange={onRequestChange}
    />
  );
}
