'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListByIdQuery } from './_api/role.api';
import { Role } from '@/models/role';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const [onRequest, setOnRequest] = useState<any>();

  const route = useRouter();
  const { organizationId } = useAuth();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListByIdQuery();

  const config: EntityConfig<Role> = useMemo(() => {
    return {
      basePath: '/roles',
      mode: 'list',
      entity: 'Role',
      primaryKey: 'id',
      title: 'Roles',
      onAdd: () => {
        route.push(`/roles/new`);
      },
      onDetail: (selected: Role) => {
        route.push(`/roles/${selected?.id}`);
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
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

  const mode =
    pathname === `/roles`
      ? 'list'
      : pathname === `/roles/new`
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
