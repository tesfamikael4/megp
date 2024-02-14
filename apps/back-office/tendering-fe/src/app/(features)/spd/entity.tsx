'use client';
import { Spd } from '@/models/spd/spd.model';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/spd.api';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListQuery();

  const config: EntityConfig<Spd> = useMemo(() => {
    return {
      basePath: '/spd',
      mode: 'list',
      entity: 'spd',
      primaryKey: 'id',
      title: 'Standard Procurement Document',
      onAdd: () => {
        route.push(`/spd/new`);
      },
      onDetail: (selected: Spd) => {
        route.push(`/spd/${selected?.id}`);
      },

      onSearch: (search) => {
        // console.log('search', search);
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
        {
          id: 'category',
          header: 'Procurement Category',
          accessorKey: 'procurementCategory',
          cell: (info) => info.getValue(),
        },
        {
          id: 'marketType',
          header: 'Market Type',
          accessorKey: 'marketType',
          cell: (info) => info.getValue(),
        },
        {
          id: 'isActive',
          header: 'Active',
          accessorKey: 'isActive',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

  const mode =
    pathname === `/spd` ? 'list' : pathname === `/spd/new` ? 'new' : 'detail';

  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={
        data?.items?.map((item: Spd) => {
          return {
            ...item,
            isActive: item.isActive ? 'Active' : 'Inactive ',
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
