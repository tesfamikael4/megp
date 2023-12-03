'use client';
import { Organization } from '@/models/organization';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListArchivedByIdQuery } from '../../units/_api/unit.api';
import { Restore } from './_components/restore';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const [onRequest, setOnRequest] = useState<any>();

  const { user } = useAuth();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListArchivedByIdQuery();

  const config: EntityConfig<Organization> = useMemo(() => {
    return {
      basePath: '/archived/units',
      mode: 'list',
      entity: 'unit',
      title: 'Archived units',
      searchable: true,
      pagination: true,
      sortable: true,
      hasAdd: false,
      hasDetail: false,

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
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'isActive',
          header: 'Active',
          accessorKey: 'isActive',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },

        {
          id: 'action',
          header: 'Action',
          accessorKey: 'action',
          cell: (info) => <Restore original={info.row.original} />,
        },
      ],
    };
  }, []);

  const mode = pathname === `/archived/units` ? 'list' : 'detail';

  const onRequestChange = useCallback(
    (request: CollectionQuery) => {
      trigger({ id: user?.organization?.id, collectionQuery: request });
    },
    [trigger, user?.organization?.id],
  );

  useEffect(() => {
    setOnRequest(onRequestChange);
  }, [onRequestChange, onRequest]);

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={
        data?.items?.map((item: Organization) => {
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
