'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useLazyListByIdQuery } from './_api/role.api';
import { Role } from '@/models/role';
import { useAuth } from '@megp/auth';
import { logger } from '@megp/core-fe';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const { user } = useAuth();
  const [onRequest, setOnRequest] = useState<any>();
  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListByIdQuery();

  const config: EntityConfig<Role> = useMemo(() => {
    return {
      basePath: '/system-role',
      mode: 'list',
      entity: 'system-roles',
      primaryKey: 'id',
      title: 'System roles',

      onDetail: (selected: Role) => {
        route.push(`/system-role/${selected?.id}`);
      },

      searchable: true,
      pagination: true,
      sortable: true,
      hasAdd: false,

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
    pathname === `/system-role`
      ? 'list'
      : pathname === `/system-role/new`
      ? 'new'
      : 'detail';

  useEffect(() => {
    const onRequestChange = (request: CollectionQuery) => {
      user !== undefined &&
        trigger({ id: user?.organization?.id, collectionQuery: request });
    };
    setOnRequest(onRequestChange);
  }, [trigger, user]);

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={data?.items ?? []}
      total={data?.total ?? 0}
      detail={children}
      isLoading={isFetching}
      onRequestChange={onRequest}
    />
  );
}
