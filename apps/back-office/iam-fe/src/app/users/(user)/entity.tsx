'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useListByIdQuery } from '../_api/user.api';

import { User } from '@/models/user/user';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [data, setData] = useState<User[]>([]);

  const { data: list, isSuccess, isLoading } = useListByIdQuery();

  useEffect(() => {
    if (isSuccess) {
      setData(
        list?.items?.map((item: User) => {
          return { ...item, isActive: item.isActive ? 'Active' : 'Inactive ' };
        }),
      );
    }
  }, [isSuccess, list?.items]);

  const config: EntityConfig<User> = useMemo(() => {
    return {
      basePath: '/users',
      mode: 'list',
      entity: 'user',
      primaryKey: 'id',
      title: 'Users',
      onAdd: () => {
        route.push(`/users/new`);
      },
      onDetail: (selected: User) => {
        route.push(`/users/${selected?.id}`);
      },

      onSearch: (search) => {
        // console.log('search', search);
      },

      pagination: true,
      searchable: true,
      sortable: true,
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
        },
        {
          id: 'email',
          header: 'Email',
          accessorKey: 'email',
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
    pathname === `/users`
      ? 'list'
      : pathname === `/users/new`
      ? 'new'
      : 'detail';

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={data}
      detail={children}
      isLoading={isLoading}
    />
  );
}
