'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ItemSubCategory } from '@/models/item-sub-category';
import { TreeConfig, logger } from '@megp/core-fe';
import { useLazyListQuery } from './_api/item-sub-category';

export function Entity({
  children,
  hasTree,
}: {
  children: React.ReactElement;
  hasTree?: boolean;
}) {
  const route = useRouter();
  const [getAll, { data: AllData }] = useLazyListQuery();

  const config: EntityConfig<ItemSubCategory> = useMemo(() => {
    return {
      basePath: '/item-sub-category',
      mode: 'list',
      entity: 'item-sub-category',
      primaryKey: 'id',
      title: 'Item Sub-Categories',

      onDetail: (selected: ItemSubCategory) => {
        route.push(`/item-sub-category/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/item-sub-category/new`);
      },

      onSearch: (search: any) => {
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
    pathname === `/item-sub-category`
      ? 'list'
      : pathname === `/item-sub-category/new`
        ? 'new'
        : 'detail';

  const onRequestChange = (request: CollectionQuery) => {
    getAll(request);
  };

  const parent = [
    { id: '1', name: 'Goods', description: 'Goods' },
    { id: '2', name: 'Service', description: 'Service' },
    { id: '3', name: 'Work', description: 'Work' },
  ];

  // Merge child data with parent categories
  const child = AllData?.items || [];
  const merge = child.map((p) => {
    const par = parent.filter((c) => c.name === p.parentCategories);
    return {
      ...p,
      parentId: par[0]?.id,
    };
  });

  const treeConfig: TreeConfig<any> = {
    id: 'id',
    label: 'name',
    load: async (data) => {
      const temp = mergedAndParentData.filter((d) => d.parentId === data.id);
      logger.log({ temp });
      return { result: temp, loading: false };
    },
    onClick: (item: any) => {
      route.push(`/item-sub-category/${item.id}`);
    },
  };

  const mergedAndParentData = [...merge, ...parent];
  logger.log({ mergedAndParentData });

  return (
    <>
      <EntityLayout
        hasTree={true}
        mode={mode}
        config={config}
        treeConfig={treeConfig}
        data={mergedAndParentData}
        total={AllData?.total ?? 0}
        onRequestChange={onRequestChange}
        detail={children}
      />
    </>
  );
}
