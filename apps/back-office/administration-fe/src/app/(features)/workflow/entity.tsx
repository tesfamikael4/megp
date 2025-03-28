'use client';
import { useLazyGetAllActivitiesQuery } from '@/store/api/workflow/workflow.api';
import { useLazyListQuery } from './_api/activities.api';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [trigger, { data: activities, isFetching }] =
    useLazyGetAllActivitiesQuery();

  const config: EntityConfig<any> = useMemo(() => {
    return {
      basePath: '/workflow',
      mode: 'list',
      entity: 'activity',
      primaryKey: 'title',
      title: 'Activities',
      onAdd: () => {
        route.push(`/workflow/new`);
      },
      onDetail: (selected: any) => {
        route.push(`/workflow/${selected?.id}`);
      },
      hasAdd: true,
      hasDetail: true,
      pagination: true,
      searchable: true,
      sortable: true,

      columns: [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'title',
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

  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };

  const mode =
    pathname === `/workflow`
      ? 'list'
      : pathname === `/workflow/new`
        ? 'new'
        : 'detail';

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={activities?.items ?? []}
      total={activities?.total ?? 0}
      detail={children}
      isLoading={isFetching}
      onRequestChange={onRequestChange}
    />
  );
}
