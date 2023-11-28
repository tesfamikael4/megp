'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useLazyListByIdQuery } from './_api/unit.api';
import { Unit } from '@/models/unit';
import { useAuth } from '@megp/auth';
import { logger } from '@megp/core-fe';

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
      entity: 'units',
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
      // selectable: true,
      onSearch: (search) => {
        // console.log('search', search);
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

  useEffect(() => {
    const onRequestChange = (request: CollectionQuery) => {
      trigger({ id: user?.organization?.id, collectionQuery: request });
    };

    user?.organization?.id !== undefined && setOnRequest(onRequestChange);
  }, [trigger, user?.organization?.id]);
  return (
    <EntityLayout
      mode={mode}
      // hasTree
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
      onRequestChange={onRequest}
    />
  );
}
