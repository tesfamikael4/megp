'use client';
import { Organization } from '@/models/organization';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListArchivedByIdQuery } from '../../roles/_api/role.api';
import { Restore } from './_components/restore';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const [onRequest, setOnRequest] = useState<any>();

  const { organizationId } = useAuth();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListArchivedByIdQuery();

  const config: EntityConfig<Organization> = useMemo(() => {
    return {
      basePath: '/archived/role',
      mode: 'list',
      entity: 'role',
      title: 'Archived roles',
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
          id: 'action',
          header: 'Action',
          accessorKey: 'action',
          cell: (info) => <Restore original={info.row.original} />,
        },
      ],
    };
  }, []);

  const mode = pathname === `/archived/roles` ? 'list' : 'detail';

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
