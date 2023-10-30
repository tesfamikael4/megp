'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useListQuery } from './_api/item-master.api';
import { ItemMaster } from '@/models/item-master';
import { logger } from '@megp/core-fe';
import { Box } from '@mantine/core';

export function Entity({ children }: { children: React.ReactElement }) {
  const [castedData, setCastedData] = useState<ItemMaster[]>([]);
  const route = useRouter();

  const { data: list, isLoading, isError } = useListQuery();

  logger.log('list', list, isLoading, isError);

  const config: EntityConfig<Partial<ItemMaster>> = useMemo(() => {
    return {
      basePath: `/item-master`,
      mode: 'list',
      entity: 'Item Master',
      primaryKey: 'id',
      title: `Item Master`,
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
          id: 'name',
          header: 'Description',
          accessorKey: 'description',
          cell: (info) => info.getValue(),
        },
        {
          id: 'itemCode',
          header: 'Item Code',
          accessorKey: 'itemCode',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },

        {
          id: 'uOMName',
          header: 'Unit of Measurement',
          accessorKey: 'uOMName',
          cell: (info) => info.getValue(),
        },
        {
          id: 'commodity',
          header: 'Commodity ',
          accessorKey: 'commodity',
          cell: (info) => info.getValue(),
        },

        {
          id: 'itemSubcategoryName',
          header: 'Item Catagory',
          accessorKey: 'itemSubcategoryName',
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

  useEffect(() => {
    const tempData: ItemMaster[] = [];
    list?.items &&
      list.items.map((item) => {
        tempData.push({
          commodity: `${item.commodityName}  (${item.commodityCode})`,
          ...item,
        });
      });

    setCastedData([...tempData]);
  }, [list]);
  return (
    <Box className="w-full">
      <EntityLayout
        mode={mode}
        config={config}
        // data={list?.items ?? []}
        data={castedData}
        detail={children}
      />
    </Box>
  );
}
