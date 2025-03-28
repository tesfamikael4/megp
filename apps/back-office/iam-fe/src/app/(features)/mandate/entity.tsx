'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/mandate.api';
import { Mandate } from '@/models/mandate';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListQuery();

  const config: EntityConfig<Mandate> = useMemo(() => {
    return {
      basePath: '/mandate',
      mode: 'list',
      entity: 'mandate',
      primaryKey: 'id',
      title: 'Mandates',

      onDetail: (selected: Mandate) => {
        route.push(`/mandate/${selected?.id}`);
      },
      hasAdd: false,
      hasDetail: true,
      pagination: true,
      searchable: true,
      sortable: true,
      // onSearch: (search) => {
      //   // console.log('search', search);
      // },

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
        {
          id: 'isSingleAssignment',
          header: 'Single Assignment ',
          accessorKey: 'isSingleAssignment',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

  const mode =
    pathname === `/mandate`
      ? 'list'
      : pathname === `/mandate/new`
        ? 'new'
        : 'detail';

  const onRequestChange = (request: CollectionQuery) => {
    request.includes = [
      'organizationMandates',
      'organizationMandates.organization',
    ];
    trigger(request);
  };

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={
        data?.items?.map((item: Mandate) => {
          return {
            ...item,
            isSingleAssignment: item.isSingleAssignment ? 'Yes' : 'No ',
          };
        }) ?? []
      }
      total={data?.total ?? 0}
      detail={children}
      isLoading={isFetching}
      onRequestChange={onRequestChange}
    />
  );
}
