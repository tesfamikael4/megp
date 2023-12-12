'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { logger } from '@megp/core-fe';
import { useLazyListQuery } from './_api/district.api';
import { District } from '@/models/district';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();

  const config: EntityConfig<District> = useMemo(() => {
    return {
      basePath: '/lookup/district',
      mode: 'list',
      entity: 'district',
      primaryKey: 'id',
      title: 'District',
      hasAdd: true,
      pagination: true,
      searchable: true,
      sortable: true,
      onDetail: (selected: District) => {
        route.push(`/lookup/district/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/lookup/district/new`);
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
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname === `/lookup/district`
      ? 'list'
      : pathname === `/lookup/district/new`
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
