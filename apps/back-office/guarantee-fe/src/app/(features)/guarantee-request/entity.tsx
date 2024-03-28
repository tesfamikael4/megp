'use client';

import { GuaranteeRequest } from '@/models/guarantee-request';
import { Box } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useListQuery } from './_api/guarantee-request.api';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const { data: list } = useListQuery({});

  const config: EntityConfig<Partial<GuaranteeRequest>> = useMemo(() => {
    return {
      basePath: `/guarantee-request`,
      mode: 'list',
      entity: 'Guarantee Requests',
      primaryKey: 'id',
      primaryContent: 'vendorId',
      title: `Guarantee Requests`,
      hasAdd: false,
      searchable: true,
      pagination: true,
      onDetail: (selected: GuaranteeRequest) => {
        logger.log('detail', selected);
        route.push(`/guarantee-request/${selected.id}`);
      },

      columns: [
        {
          id: 'vendorName',
          header: 'Economic Operator Name',
          accessorKey: 'vendorName',
          meta: {
            widget: 'primary',
          },
          cell: (info) => info.getValue(),
        },

        {
          id: 'title',
          header: 'Procurement Title',
          accessorKey: 'title',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },
        {
          id: 'name',
          header: 'Procuring Entity Name ',
          accessorKey: 'name',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },

        {
          id: 'type',
          header: 'Guarantee Request Type',
          accessorKey: 'type',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname == '/guarantee-request'
      ? 'list'
      : pathname == '/guarantee-request/new'
        ? 'new'
        : 'detail';

  return (
    <Box className="w-full">
      <EntityLayout
        mode={mode}
        config={config}
        total={list?.total ?? 0}
        data={list?.items ?? []}
        detail={children}
      />
    </Box>
  );
}
