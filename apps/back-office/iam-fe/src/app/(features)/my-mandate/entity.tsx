'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useLazySecondRelationQuery } from '../organizations/_api/organization-mandate.api';
import { Mandate } from '@/models/mandate';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const { user } = useAuth();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazySecondRelationQuery();

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
          id: 'name',
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

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      id: user?.organization.id,
      collectionQuery: request,
    });
  };

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={data?.items ?? []}
      total={data?.total ?? 0}
      detail={children}
      isLoading={isFetching}
      onRequestChange={onRequestChange}
    />
  );
}
