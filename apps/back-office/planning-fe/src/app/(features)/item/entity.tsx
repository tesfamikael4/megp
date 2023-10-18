'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Item } from '@/models/item';
import { useListQuery } from './_api/item.api';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [data, setData] = useState<Item[]>([]);
  const { data: list, isSuccess } = useListQuery();

  useEffect(() => {
    if (isSuccess) {
      setData(
        list.items.map((item: Item) => {
          return { ...item };
        }),
      );
    }
  }, [isSuccess, list?.items]);

  const config: EntityConfig<Item> = useMemo(() => {
    return {
      basePath: '/item',
      mode: 'list',
      entity: 'item',
      primaryKey: 'id',
      title: 'Items',
      onAdd: () => {
        route.push(`/item/new`);
      },
      onDetail: (selected: Item) => {
        route.push(`/item/${selected.id}`);
      },

      selectable: true,
      columns: [
        {
          id: 'itemName',
          header: 'Item Name',
          accessorKey: 'itemCode',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'multiline',
          },
        },
        {
          id: 'name',
          header: 'Item Description',
          accessorKey: 'itemCodeDescription',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'multiline',
          },
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname === `/item` ? 'list' : pathname === `/item/new` ? 'new' : 'detail';

  return (
    <EntityLayout mode={mode} config={config} data={data} detail={children} />
  );
}
