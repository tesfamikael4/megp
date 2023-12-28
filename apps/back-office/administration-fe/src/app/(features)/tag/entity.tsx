'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useListQuery } from './_api/tags.api';
import { logger } from '@megp/core-fe';
import { Tag } from '@/models/Tag';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const { data: list } = useListQuery({} as any);

  const config: EntityConfig<Tag> = useMemo(() => {
    return {
      basePath: '/tag',
      mode: 'list',
      entity: 'tag',
      primaryKey: 'id',
      title: 'Tags',
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

  return (
    <>
      <EntityLayout
        mode={mode}
        config={config}
        data={list?.items ? list.items : []}
        detail={children}
      />
    </>
  );
}
