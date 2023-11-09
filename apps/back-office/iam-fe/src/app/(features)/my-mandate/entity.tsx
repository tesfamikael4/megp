'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useLazySecondRelationQuery } from '../organizations/_api/organization-mandate.api';
import { Mandate } from '@/models/mandate';
import { logger } from '@megp/core-fe';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [trigger, { data: list, isLoading }] = useLazySecondRelationQuery();

  useEffect;
  const config: EntityConfig<Mandate> = useMemo(() => {
    return {
      basePath: '/my-mandate',
      mode: 'list',
      entity: 'my-mandate',
      primaryKey: 'id',
      title: 'My Mandates',
      onDetail: (selected: Mandate) => {
        route.push(`/my-mandate/${selected?.id}`);
      },

      onSearch: (search) => {
        // console.log('search', search);
      },
      pagination: true,
      searchable: true,
      sortable: true,

      hasAdd: false,
      hasDetail: false,
      columns: [
        {
          id: 'mandate.name',
          header: 'Name',
          accessorKey: 'mandate.name',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },

        {
          id: 'mandate.description',
          header: 'Description',
          accessorKey: 'mandate.description',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

  const mode =
    pathname === `/my-mandate`
      ? 'list'
      : pathname === `/my-mandate/new`
      ? 'new'
      : 'detail';

  useEffect(() => {
    trigger('099454a9-bf8f-45f5-9a4f-6e9034230250');
  }, [trigger]);

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={list?.items ? list?.items : []}
      detail={children}
      isLoading={isLoading}
    />
  );
}
