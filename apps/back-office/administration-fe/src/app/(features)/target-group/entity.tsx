'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { logger } from '@megp/core-fe';
import { useLazyListQuery } from './_api/target-group.api';
import { TargetGroup } from '@/models/target-group';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();

  const config: EntityConfig<TargetGroup> = useMemo(() => {
    return {
      basePath: '/Target-groups',
      mode: 'list',
      entity: 'Target-groups',
      primaryKey: 'id',
      title: 'Target Groups',
      hasAdd: true,
      pagination: true,
      searchable: true,
      sortable: true,
      onDetail: (selected: TargetGroup) => {
        route.push(`/target-group/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/target-group/new`);
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
        {
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
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
    pathname === `/target-group`
      ? 'list'
      : pathname === `/target-group/new`
      ? 'new'
      : 'detail';
  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };

  return (
    <>
      <EntityLayout
        mode={mode}
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
        detail={children}
      />
    </>
  );
}
