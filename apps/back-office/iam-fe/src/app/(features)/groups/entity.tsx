'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListByIdQuery, useLazyListQuery } from './_api/group.api';
import { Group } from '@/models/group';
import { logger } from '@megp/core-fe';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const [onRequest, setOnRequest] = useState<any>();

  const pathname = usePathname();
  const { user } = useAuth();

  const [trigger, { data, isFetching }] = useLazyListByIdQuery();

  const config: EntityConfig<Group> = useMemo(() => {
    return {
      basePath: '/groups',
      mode: 'list',
      entity: 'groups',
      primaryKey: 'id',
      title: 'Groups',
      onAdd: () => {
        route.push(`/groups/new`);
      },
      onDetail: (selected: Group) => {
        route.push(`/groups/${selected.id}`);
      },
      pagination: true,
      searchable: true,
      sortable: true,
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
    pathname === `/groups`
      ? 'list'
      : pathname === `/groups/new`
      ? 'new'
      : 'detail';

  const onRequestChange = useCallback(
    (request: CollectionQuery) => {
      trigger({ id: user?.organization?.id, collectionQuery: request });
    },
    [trigger, user?.organization?.id],
  );

  useEffect(() => {
    setOnRequest(onRequestChange);
  }, [onRequestChange, onRequest]);

  return (
    <>
      <EntityLayout
        mode={mode}
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        detail={children}
        isLoading={isFetching}
        onRequestChange={onRequestChange}
      />
    </>
  );
}
