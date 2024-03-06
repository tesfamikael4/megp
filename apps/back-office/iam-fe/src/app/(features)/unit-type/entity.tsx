'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListByIdQuery } from './_api/unit-type.api';
import { UnitType } from '@/models/unit-type';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [onRequest, setOnRequest] = useState<any>();

  const pathname = usePathname();
  const { organizationId } = useAuth();

  const [trigger, { data, isFetching }] = useLazyListByIdQuery();

  useEffect;
  const config: EntityConfig<UnitType> = useMemo(() => {
    return {
      basePath: '/unit-type',
      mode: 'list',
      entity: 'unit-type',
      primaryKey: 'id',
      title: 'Unit Type',
      onAdd: () => {
        route.push(`/unit-type/new`);
      },
      onDetail: (selected: UnitType) => {
        route.push(`/unit-type/${selected?.id}`);
      },
      pagination: true,
      searchable: true,
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

  const onRequestChange = useCallback(
    (request: CollectionQuery) => {
      trigger({ id: organizationId, collectionQuery: request });
    },
    [trigger, organizationId],
  );

  useEffect(() => {
    setOnRequest(onRequestChange);
  }, [onRequestChange, onRequest]);

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
