'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListUserQuery } from '../_api/custom.api';
import { User } from '@/models/user/user';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [onRequest, setOnRequest] = useState<any>();

  const pathname = usePathname();
  const { organizationId } = useAuth();

  const [trigger, { data, isFetching }] = useLazyListUserQuery();

  const config: EntityConfig<User> = useMemo(() => {
    return {
      basePath: '/users',
      mode: 'list',
      entity: 'users',
      primaryKey: 'id',
      title: 'Users',
      onAdd: () => {
        route.push(`/users/new`);
      },
      onDetail: (selected: User) => {
        route.push(`/users/${selected?.id}`);
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
      organizationId !== undefined &&
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
      data={data?.items ?? []}
      total={data?.total ?? 0}
      detail={children}
      isLoading={isFetching}
      onRequestChange={onRequestChange}
    />
  );
}
