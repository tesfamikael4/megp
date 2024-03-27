'use client';

import { GuaranteeRequest } from '@/models/guarantee-request/guarantee-request';
import { Box } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/guarantee-request.api';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const [trigger, { data, isLoading }] = useLazyListQuery();

  const config: EntityConfig<Partial<GuaranteeRequest>> = useMemo(() => {
    return {
      basePath: `/guarantee/guarantee-request`,
      mode: 'list',
      entity: 'Guarantee Requests',
      primaryKey: 'vendorId',
      primaryContent: 'vendorId',
      title: `Guarantee Requests`,
      hasAdd: false,
      searchable: true,
      pagination: true,
      isLoading: isLoading,
      onDetail: (selected: GuaranteeRequest) => {
        logger.log('detail', selected);
        route.push(`/guarantee/guarantee-request/${selected.id}`);
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
    pathname == '/guarantee/guarantee-request'
      ? 'list'
      : pathname == '/guarantee/guarantee-request/new'
        ? 'new'
        : 'detail';
  const onRequestChange = (request: any) => {
    request.where.push([
      {
        column: 'status',
        operator: '=',
        value: 'APPROVED',
      },
    ]);
    trigger(request);
  };
  return (
    <Box className="w-full">
      <EntityLayout
        mode={mode}
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
        detail={children}
      />
    </Box>
  );
}
