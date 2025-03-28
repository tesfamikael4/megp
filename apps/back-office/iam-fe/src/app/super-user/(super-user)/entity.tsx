'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListSuperUserQuery } from '@/store/api/super-user/custom.api';
import { User } from '@/models/user/user';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();
  const { organizationId } = useAuth();

  const [trigger, { data, isFetching }] = useLazyListSuperUserQuery();

  const config: EntityConfig<User> = useMemo(() => {
    return {
      basePath: '/super-user',
      mode: 'list',
      entity: 'user',
      primaryKey: 'id',
      title: 'Users',
      onAdd: () => {
        route.push(`/super-user/new`);
      },
      onDetail: (selected: User) => {
        route.push(`/super-user/${selected?.id}`);
      },
      searchable: true,
      pagination: true,
      sortable: true,
      primaryContent: 'account.firstName',
      columns: [
        {
          id: 'account.firstName',
          header: 'Name',
          accessorKey: 'account.firstName',
          cell: ({ row }) => (
            <div>{row.original.firstName + ' ' + row.original.lastName}</div>
          ),
        },
        {
          id: 'account.username',
          header: 'Username',
          accessorKey: 'username',
          cell: (info) => info.getValue(),
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
    pathname === `/super-user`
      ? 'list'
      : pathname === `/super-user/new`
        ? 'new'
        : 'detail';

  const onRequestChange = useCallback(
    (request: CollectionQuery) => {
      organizationId !== undefined &&
        trigger({ id: organizationId, collectionQuery: request });
    },
    [trigger, organizationId],
  );

  useEffect(() => {
    onRequestChange({ skip: 0, take: 15 });
  }, []);

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={
        data?.items?.map((item: User) => {
          return {
            ...item,
            status:
              item.status.charAt(0).toUpperCase() +
              item.status.slice(1).toLowerCase(),
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
