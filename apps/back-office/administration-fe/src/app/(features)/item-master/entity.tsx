'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useLazyListQuery, useListQuery } from './_api/item-master.api';
import { ItemMaster } from '@/models/item-master';
import { logger } from '@megp/core-fe';
import { Box } from '@mantine/core';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();

  // const { data: list, isLoading, isError } = useListQuery({});
  const [getItems, { data: list, isLoading, isError }] = useLazyListQuery({});

  logger.log('list', list, isLoading, isError);

  const config: EntityConfig<Partial<ItemMaster>> = useMemo(() => {
    return {
      basePath: `/item-master`,
      mode: 'list',
      entity: 'Items',
      primaryKey: 'id',
      primaryContent: 'description',
      title: `Items`,
      searchable: true,
      pagination: true,
      onAdd: () => {
        logger.log('new');
        route.push(`/item-master/new`);
      },
      onDetail: (selected: ItemMaster) => {
        logger.log('detail', selected);
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
          id: 'commodity',
          header: 'Classification ',
          accessorKey: 'commodity',
          meta: {
            widget: 'expand',
          },
          cell: ({ row: { original } }: any) => (
            <>
              {original.commodityName} ({original.commodityCode})
            </>
          ),
        },

        {
          id: 'itemSubcategoryName',
          header: 'Item Catagory',
          accessorKey: 'itemSubcategoryName',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
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
