'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useLazyListQuery } from './_api/item-master.api';
import { ItemMaster } from '@/models/item-master';
import { logger } from '@megp/core-fe';
import { Box, Text } from '@mantine/core';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();

  const [getItems, { data: list }] = useLazyListQuery({});

  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const config: EntityConfig<Partial<ItemMaster>> = useMemo(() => {
    return {
      basePath: `/item-master`,
      mode: 'list',
      entity: 'Items',
      primaryKey: 'id',
      primaryContent: 'description',
      title: `Item Master`,
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
          cell: ({ row: { original } }: any) => {
            return (
              <>
                <Text
                  size="sm"
                  onClick={toggleShowMore}
                  className="cursor-pointer"
                >
                  {original.commodityName && (
                    <>
                      {original.commodityName.length <= 95 ? (
                        original.commodityName
                      ) : (
                        <>
                          {showMore
                            ? original.commodityName
                            : original.commodityName.slice(0, 95) + '...'}
                          <span className="text-xs ml-3 text-blue-500">
                            {showMore ? 'See Less' : 'See More'}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </Text>
              </>
            );
          },
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
