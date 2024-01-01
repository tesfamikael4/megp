'use client';
import { EntityConfig, CollectionQuery, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/tags.api';
import { logger } from '@megp/core-fe';
import { Tag } from '@/models/Tag';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();

  const config: EntityConfig<Tag> = useMemo(() => {
    return {
      basePath: '/tag',
      mode: 'list',
      entity: 'tag',
      primaryKey: 'id',
      title: 'Tags',
      hasAdd: true,
      searchable: true,
      pagination: true,
      sortable: true,
      onDetail: (selected: Tag) => {
        route.push(`/tag/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/tag/new`);
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
            widget: 'multiline',
          },
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname === `/tag` ? 'list' : pathname === `/tag/new` ? 'new' : 'detail';

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
        detail={children}
        onRequestChange={onRequestChange}
      />
    </>
  );
}
