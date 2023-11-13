'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Measurement } from '@/models/measurement';
import { logger } from '@megp/core-fe';
import { useListQuery } from './_api/item-category';

export function Entity({
  children,
  hasTree,
}: {
  children: React.ReactElement;
  hasTree?: boolean;
}) {
  const route = useRouter();
  const { data: list } = useListQuery();

  // const {
  //   data: selected,
  //   isLoading: selectedLoading,
  //   isError: selectedError,
  // } = useReadQuery('id');

  // logger.log('selected', selected, selectedLoading, selectedError);

  const config: EntityConfig<Measurement> = useMemo(() => {
    return {
      basePath: '/item-Categories',
      mode: 'list',
      entity: 'item-Categories',
      primaryKey: 'id',
      title: 'item-Categories',
      onDetail: (selected: Measurement) => {
        route.push(`/item-category/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/item-category/new`);
      },

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
        // {
        //   id: 'parentId',
        //   header: 'parentId',
        //   accessorKey: 'parentId',
        //   cell: (info) => info.getValue(),
        //   meta: {
        //     widget: 'multiline',
        //   },
        // },
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

  return (
    <>
      {hasTree ? (
        <EntityLayout
          hasTree={true}
          mode={mode}
          config={config}
          data={list?.items ? list.items : []}
          detail={children}
        />
      ) : (
        <EntityLayout
          hasTree={false}
          mode={mode}
          config={config}
          data={list?.items ? list.items : []}
          detail={children}
        />
      )}
    </>
  );
}
