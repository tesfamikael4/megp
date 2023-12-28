'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { logger } from '@megp/core-fe';
import { Currency } from '@/models/currency';
import { useLazyListQuery } from './_api/currency.api';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();

  const config: EntityConfig<Currency> = useMemo(() => {
    return {
      basePath: '/currencies',
      mode: 'list',
      entity: 'currencies',
      primaryKey: 'id',
      title: 'Currencies',
      hasAdd: true,
      pagination: true,
      searchable: true,
      sortable: true,
      onDetail: (selected: Currency) => {
        route.push(`/currency/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/currency/new`);
      },

      onSearch: (search) => {
        logger.log('search', search);
      },

      columns: [
        {
          id: 'description',
          header: 'description',
          accessorKey: 'description',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'multiline',
          },
        },
        {
          id: 'abbreviation',
          header: 'abbreviation',
          accessorKey: 'abbreviation',
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
    pathname === `/currency`
      ? 'list'
      : pathname === `/currency/new`
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
