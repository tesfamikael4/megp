'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { logger } from '@megp/core-fe';
import { Donor } from '@/models/donor';
import { useLazyListQuery } from './_api/donor.api';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();
  const pathname = usePathname();

  useEffect;
  const config: EntityConfig<Donor> = useMemo(() => {
    return {
      basePath: '/lookup/donors',
      mode: 'list',
      entity: 'donors',
      primaryKey: 'id',
      title: 'Donors',
      onAdd: () => {
        route.push(`/lookup/donors/new`);
      },
      onDetail: (selected: Donor) => {
        route.push(`/lookup/donors/${selected?.id}`);
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
    pathname === `/lookup/donors`
      ? 'list'
      : pathname === `/lookup/donors/new`
        ? 'new'
        : 'detail';

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
