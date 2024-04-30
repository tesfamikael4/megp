'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Measurement } from '@/models/measurement';
import { logger, TreeConfig } from '@megp/core-fe';
import { useLazyListQuery } from './_api/item-category';
import { ItemCategory } from '@/models/item-category';
import { useDebouncedState } from '@mantine/hooks';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const [trigger, { data, isLoading: isCategoriesLoading }] =
    useLazyListQuery();
  const [search] = useDebouncedState('', 500);

  const config: EntityConfig<Measurement> = useMemo(() => {
    return {
      basePath: '/item-category',
      mode: 'list',
      entity: 'item-Categories',
      primaryKey: 'id',
      title: 'Item Categories',

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

  useEffect(() => {
    trigger({
      where: [
        [
          {
            column: 'name',
            operator: 'ILIKE',
            value: search,
          },
        ],
      ],
    });
  }, [search]);

  const treeConfig: TreeConfig<any> = {
    id: 'id',
    label: 'name',
    load: async (data) => {
      logger.log({ data });
      const res = await trigger({
        where: [
          [
            {
              column: 'parentId',
              value: data.id,
              operator: 'ILIKE',
            },
          ],
        ],
      }).unwrap();
      logger.log('res', res);
      return {
        result: res?.items?.map((c) => ({
          id: c.id,
          name: c.name,
        })),
        loading: isCategoriesLoading,
      };
    },
    onClick: (item: ItemCategory) => {
      route.push(`/item-category/${item.id}`);
    },
  };
  logger.log('data', data);
  return (
    <>
      <EntityLayout
        hasTree
        mode={mode}
        config={config}
        treeConfig={treeConfig}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
        detail={children}
      />
    </>
  );
}
