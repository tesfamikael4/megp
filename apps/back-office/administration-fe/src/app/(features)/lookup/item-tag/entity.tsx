'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mantine/core';
import { useListQuery } from './_api/tag.api';
import { Tag } from '@/models/Tag';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const { data: uoms, isSuccess, isLoading, isFetching } = useListQuery({});

  useEffect(() => {
    if (isSuccess) {
      setTags(uoms?.items ?? []);
    }
  }, [uoms, isSuccess]);

  const search = (text: string) => {
    if (text.length > 0) {
      const found = tags.filter(
        (e) => e.name.toLowerCase().indexOf(text.toLocaleLowerCase()) !== -1,
      );
      if (found) setTags(found);
    } else {
      setTags(uoms?.items ?? []);
    }
  };
  const config: EntityConfig<Partial<Tag>> = useMemo(() => {
    return {
      basePath: `/lookup/item-tag`,
      mode: 'list',
      entity: 'Item Tag',
      primaryKey: 'id',
      title: `Item Tag`,
      onAdd: () => {
        route.push(`/lookup/item-tag/new`);
      },
      onDetail: (selected: Tag) => {
        route.push(`/lookup/item-tag/${selected.id}`);
      },
      onSearch: (text: string) => search(text),

      columns: [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname === '/lookup/item-tag'
      ? 'list'
      : pathname === '/lookup/item-tag/new'
      ? 'new'
      : 'detail';
  return (
    <Box className="w-full">
      <EntityLayout
        mode={mode}
        config={config}
        data={uoms?.items ?? []}
        detail={children}
        isLoading={isFetching || isLoading}
      />
    </Box>
  );
}
