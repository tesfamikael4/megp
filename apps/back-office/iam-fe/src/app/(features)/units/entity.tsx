'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListByIdQuery } from './_api/unit.api';
import { Unit } from '@/models/unit';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const { user } = useAuth();

  const pathname = usePathname();
  const [onRequest, setOnRequest] = useState<any>();

  const [trigger, { data, isFetching }] = useLazyListByIdQuery();

  const config: EntityConfig<Unit> = useMemo(() => {
    return {
      basePath: '/units',
      mode: 'list',
      entity: 'unit',
      primaryKey: 'id',
      title: 'Units',
      onAdd: () => {
        route.push(`/units/new`);
      },
      onDetail: (selected: Unit) => {
        route.push(`/units/${selected?.id}`);
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
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'isActive',
          header: 'Active',
          accessorKey: 'isActive',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
      ],
    };
  }, [route]);

  const mode =
    pathname === `/units`
      ? 'list'
      : pathname === `/units/new`
      ? 'new'
      : 'detail';

  const onRequestChange = useCallback(
    (request: CollectionQuery) => {
      user !== undefined &&
        trigger({ id: user?.organization?.id, collectionQuery: request });
    },
    [trigger, user],
  );

  useEffect(() => {
    setOnRequest(onRequestChange);
  }, [onRequestChange, onRequest]);
  return (
    <EntityLayout
      mode={mode}
      hasTree
      config={config}
      data={
        data?.items?.map((item: Unit) => {
          return {
            ...item,
            isActive: item.isActive ? 'Active' : 'Inactive ',
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
