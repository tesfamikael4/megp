'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { logger } from '@megp/core-fe';
import { useLazyListQuery } from './_api/tax.api';
import { Tax } from '@/models/tax';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();
  const pathname = usePathname();

  useEffect;
  const config: EntityConfig<Tax> = useMemo(() => {
    return {
      basePath: '/tax',
      mode: 'list',
      entity: 'tax',
      primaryKey: 'id',
      title: 'Taxs',
      onAdd: () => {
        route.push(`/tax/new`);
      },
      onDetail: (selected: Tax) => {
        route.push(`/tax/${selected?.id}`);
      },

      onSearch: (search) => {
        logger.log('search', search);
      },

      searchable: true,
      pagination: true,
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

  const mode =
    pathname === `/tax` ? 'list' : pathname === `/tax/new` ? 'new' : 'detail';

  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={data?.items ?? []}
      total={data?.total ?? 0}
      onRequestChange={onRequestChange}
      detail={children}
    />
  );
}
