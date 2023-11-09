'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useListQuery } from './_api/organization.api';
import { Organization } from '@/models/organization';
import { Type } from './_components/organization-type';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  const pathname = usePathname();

  const [data, setData] = useState<Organization[]>([]);

  const { data: list, isSuccess, isLoading } = useListQuery();

  useEffect(() => {
    if (isSuccess) {
      setData(
        list.items.map((item: Organization) => {
          return { ...item, isActive: item.isActive ? 'Yes' : 'No ' };
        }),
      );
    }
  }, [isSuccess, list?.items]);

  const config: EntityConfig<Organization> = useMemo(() => {
    return {
      basePath: '/organizations',
      mode: 'list',
      entity: 'organizations',
      primaryKey: 'id',
      title: 'Organization',
      onAdd: () => {
        route.push(`/organizations/new`);
      },
      onDetail: (selected: Organization) => {
        route.push(`/organizations/${selected?.id}`);
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
          id: 'shortName',
          header: 'Short Name',
          accessorKey: 'shortName',
          cell: (info) => info.getValue(),
        },
        {
          id: 'typeId',
          header: 'Organization type',
          accessorKey: 'typeId',
          cell: (info) => <Type id={info.row.original.typeId} />,
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
    pathname === `/organizations`
      ? 'list'
      : pathname === `/organizations/new`
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
