'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/item-master.api';
import { ItemMaster } from '@/models/item-master';
import { logger } from '@megp/core-fe';
import { Box } from '@mantine/core';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();

  const [getItems, { data: list, isLoading, isError }] = useLazyListQuery({});

  logger.log('list', list, isLoading, isError);

  const config: EntityConfig<Partial<ItemMaster>> = useMemo(() => {
    return {
      basePath: `/item-master`,
      mode: 'list',
      entity: 'Items',
      primaryKey: 'id',
      primaryContent: 'description',
      title: `Item Masters`,
      searchable: true,
      sortable: true,
      pagination: true,
      onAdd: () => {
        logger.log('new');
        route.push(`/item-master/new`);
      },
      onDetail: (selected: ItemMaster) => {
        route.push(`/item-master/${selected.id}`);
      },

      columns: [
        {
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
          meta: {
            widget: 'expand',
          },
          cell: ({ row: { original } }: any) => (
            <>
              {original.description} ({original.itemCode})
            </>
          ),
        },

        {
          id: 'uOMName',
          header: 'Unit of Measurement',
          accessorKey: 'uOMName',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },
        {
          id: 'commodityName',
          header: 'Classification ',
          accessorKey: 'commodityName',
          meta: {
            widget: 'expand',
          },
          cell: ({ row: { original } }: any) => (
            <>
              {original.commodityName} ({original.commodityCode})
            </>
          ),
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname == '/item-master'
      ? 'list'
      : pathname == '/item-master/new'
        ? 'new'
        : 'detail';

  logger.log('mode', mode, pathname);

  const onRequestChange = (collectionQuery) => {
    getItems(collectionQuery);
  };

  return (
    <Box className="w-full">
      <EntityLayout
        mode={mode}
        config={config}
        onRequestChange={onRequestChange}
        total={list?.total ?? 0}
        data={list?.items ?? []}
        detail={children}
      />
    </Box>
  );
}
