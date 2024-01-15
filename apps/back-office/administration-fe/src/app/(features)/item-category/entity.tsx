'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Measurement } from '@/models/measurement';
import { logger } from '@megp/core-fe';
import { useLazyListQuery } from './_api/item-category';

export function Entity({
  children,
  hasTree,
}: {
  children: React.ReactElement;
  hasTree?: boolean;
}) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();

  const config: EntityConfig<Measurement> = useMemo(() => {
    return {
      basePath: '/item-Categories',
      mode: 'list',
      entity: 'item-Categories',
      primaryKey: 'id',
      title: 'Item-Categories',
      // hasAdd: true,

      onDetail: (selected: Measurement) => {
        route.push(`/item-category/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/item-category/new`);
      },

      onSearch: (search) => {
        logger.log('search', search);
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
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname === `/item-category`
      ? 'list'
      : pathname === `/item-category/new`
      ? 'new'
      : 'detail';
  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };

  return (
    <>
      {hasTree ? (
        <EntityLayout
          hasTree={true}
          mode={mode}
          config={config}
          data={data?.items ?? []}
          total={data?.total ?? 0}
          onRequestChange={onRequestChange}
          detail={children}
        />
      ) : (
        <EntityLayout
          hasTree={false}
          mode={mode}
          config={config}
          data={data?.items ?? []}
          total={data?.total ?? 0}
          onRequestChange={onRequestChange}
          detail={children}
        />
      )}
    </>
  );
}
