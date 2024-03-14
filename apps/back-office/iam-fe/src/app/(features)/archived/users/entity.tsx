'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListArchivedByIdQuery } from '../../../users/_api/user.api';
import { Restore } from './_components/restore';
import { useAuth } from '@megp/auth';

import { User } from '@/models/user/user';

export function Entity({ children }: { children: React.ReactNode }) {
  const { organizationId } = useAuth();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListArchivedByIdQuery();

  const config: EntityConfig<User> = useMemo(() => {
    return {
      basePath: '/archived/users',
      mode: 'list',
      entity: 'user',
      title: 'Archived Users',
      searchable: true,
      pagination: true,
      sortable: true,
      hasAdd: false,
      hasDetail: false,

      columns: [
        {
          id: 'account.firstName',
          header: 'Name',
          accessorKey: 'account.firstName',
          cell: ({ row }) => (
            <div>
              {row.original.account.firstName +
                ' ' +
                row.original.account.lastName}
            </div>
          ),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'account.username',
          header: 'Username',
          accessorKey: 'account.username',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },

        {
          id: 'action',
          header: () => <p className="ml-auto">Action</p>,
          accessorKey: 'action',
          cell: (info) => <Restore original={info.row.original} />,
        },
      ],
    };
  }, []);

  const mode = pathname === `/archived/users` ? 'list' : 'detail';

  const onRequestChange = (request: CollectionQuery) => {
    const newRequest = { ...request, includes: ['account'] };

    organizationId !== undefined &&
      trigger({ id: organizationId, collectionQuery: newRequest });
  };

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={
        data?.items?.map((item: User) => {
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
