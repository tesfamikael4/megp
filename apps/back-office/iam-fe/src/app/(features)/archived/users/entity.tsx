'use client';
import { Organization } from '@/models/organization';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyListArchivedByIdQuery } from '../../../users/_api/user.api';
import { Restore } from './_components/restore';
import { useAuth } from '@megp/auth';
import { logger } from '@megp/core-fe';

export function Entity({ children }: { children: React.ReactNode }) {
  const [onRequest, setOnRequest] = useState<any>();

  const { organizationId } = useAuth();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListArchivedByIdQuery();

  const config: EntityConfig<Organization> = useMemo(() => {
    return {
      basePath: '/archived/users',
      mode: 'list',
      entity: 'user',
      title: 'Archived users',
      searchable: true,
      pagination: true,
      sortable: true,
      hasAdd: false,
      hasDetail: false,

      columns: [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'fullName',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'username',
          header: 'User name',
          accessorKey: 'username',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'email',
          header: 'Email',
          accessorKey: 'email',
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

  const mode = pathname === `/archived/users` ? 'list' : 'detail';

  const onRequestChange = useCallback(
    (request: CollectionQuery) => {
      organizationId !== undefined &&
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
