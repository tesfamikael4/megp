'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListUserQuery } from '../_api/custom.api';
import { User } from '@/models/user/user';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();
  const { organizationId } = useAuth();

  const [trigger, { data, isFetching }] = useLazyListUserQuery();

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
          accessorKey: 'account.firstName',
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

  const onRequestChange = (request: CollectionQuery) => {
    organizationId && trigger({ id: organizationId, collectionQuery: request });
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
