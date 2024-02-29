'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListSuperUserQuery } from '../_api/custom.api';
import { User } from '@/models/user/user';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [onRequest, setOnRequest] = useState<any>();

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

      pagination: true,
      searchable: true,
      sortable: true,
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'firstName',
          cell: ({ row }) => (
            <div>{row.original.firstName + ' ' + row.original.lastName}</div>
          ),
        },
        {
          id: 'username',
          header: 'User Name',
          accessorKey: 'username',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'email',
          header: 'Email',
          accessorKey: 'email',
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
      trigger({ id: organizationId, collectionQuery: request });
    },
    [trigger, organizationId],
  );

  useEffect(() => {
    setOnRequest(onRequestChange);
  }, [onRequestChange, onRequest]);

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
