'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useLazyListByIdQuery } from './_api/unit-type.api';
import { UnitType } from '@/models/unit-type';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [onRequest, setOnRequest] = useState<any>();

  const pathname = usePathname();
  const { user } = useAuth();

  const [trigger, { data, isFetching }] = useLazyListByIdQuery();

  useEffect;
  const config: EntityConfig<UnitType> = useMemo(() => {
    return {
      basePath: '/unit-type',
      mode: 'list',
      entity: 'unit-type',
      primaryKey: 'id',
      title: 'Unit type',
      onAdd: () => {
        route.push(`/unit-type/new`);
      },
      onDetail: (selected: UnitType) => {
        route.push(`/unit-type/${selected?.id}`);
      },
      pagination: true,
      searchable: true,
      sortable: true,

      onSearch: (search) => {
        // console.log('search', search);
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

  const mode =
    pathname === `/unit-type`
      ? 'list'
      : pathname === `/unit-type/new`
      ? 'new'
      : 'detail';
  useEffect(() => {
    const onRequestChange = (request: CollectionQuery) => {
      trigger({ id: user?.organization?.id, collectionQuery: request });
    };

    user?.organization?.id !== undefined && setOnRequest(onRequestChange);
  }, [trigger, user?.organization?.id]);

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={data?.items ?? []}
      total={data?.total ?? 0}
      detail={children}
      isLoading={isFetching}
      onRequestChange={onRequest}
    />
  );
}
