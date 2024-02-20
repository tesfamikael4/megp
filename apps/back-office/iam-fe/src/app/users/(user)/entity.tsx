'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListByIdQuery } from '../_api/user.api';
import { User } from '@/models/user/user';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [onRequest, setOnRequest] = useState<any>();

  const pathname = usePathname();
  const { organizationId } = useAuth();

  const [trigger, { data, isFetching }] = useLazyListByIdQuery();

  const config: EntityConfig<User> = useMemo(() => {
    return {
      basePath: '/users',
      mode: 'list',
      entity: 'user',
      primaryKey: 'id',
      title: 'Users',
      onAdd: () => {
        route.push(`/users/new`);
      },
      onDetail: (selected: User) => {
        route.push(`/users/${selected?.id}`);
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
    pathname === `/users`
      ? 'list'
      : pathname === `/users/new`
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
            isActive: item.status === 'ACTIVE' ? 'Active' : 'Inactive ',
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
