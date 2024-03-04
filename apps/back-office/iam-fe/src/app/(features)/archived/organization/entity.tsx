'use client';
import { Organization } from '@/models/organization';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListArchivedQuery } from '../../organizations/_api/organization.api';
import { Type } from './_components/organization-type';
import { Restore } from './_components/restore';
import { Box } from '@mantine/core';

export function Entity({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazyListArchivedQuery();

  const Status = ({ original }: any) => {
    return <Box className="ml-auto p pr-6">{original.status}</Box>;
  };

  const config: EntityConfig<Organization> = useMemo(() => {
    return {
      basePath: '/archived/organization',
      mode: 'list',
      entity: 'organizations',
      title: 'Archived organizations',
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
          id: 'shortName',
          header: 'Short Name',
          accessorKey: 'shortName',
          cell: (info) => info.getValue(),
        },

        {
          id: 'typeId',
          header: 'Organization Type',
          accessorKey: 'typeId',
          cell: (info) => <Type id={info.row.original.typeId} />,
        },
        {
          id: 'status',
          header: () => <p className="ml-auto">Status</p>,
          accessorKey: 'status',
          cell: (info) => <Status original={info.row.original} />,
        },
        {
          id: 'action',
          header: () => <p className="ml-auto">Action</p>,
          cell: (info) => <Restore original={info.row.original} />,
        },
      ],
    };
  }, []);

  const mode = pathname === `/archived/organization` ? 'list' : 'detail';

  const onRequestChange = (request: CollectionQuery) => {
    request?.where?.push([
      {
        column: 'type',
        value: 'BACK-OFFICE',
        operator: '=',
      },
    ]);

    trigger(request);
  };

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={
        data?.items?.map((item: Organization) => {
          return {
            ...item,
            status:
              item.status.charAt(0).toUpperCase() +
              item.status.slice(1).toLowerCase(),
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
