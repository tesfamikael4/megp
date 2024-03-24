'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/application.api';
import { Application } from '@/models/application';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();

  const [trigger, { data, isFetching }] = useLazyListQuery();

  const config: EntityConfig<Application> = useMemo(() => {
    return {
      basePath: '/applications',
      mode: 'list',
      entity: 'applications',
      primaryKey: 'id',
      title: 'Applications',
      hasAdd: false,
      pagination: true,
      searchable: true,
      sortable: true,
      onDetail: (selected: Application) => {
        route.push(`/applications/${selected.id}`);
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
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname === `/applications`
      ? 'list'
      : pathname === `/applications/new`
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
        detail={children}
        isLoading={isFetching}
        onRequestChange={onRequestChange}
      />
    </>
  );
}
