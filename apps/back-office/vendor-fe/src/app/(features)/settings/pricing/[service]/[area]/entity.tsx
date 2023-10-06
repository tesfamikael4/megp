'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useListQuery } from './_api/price.api';
import { Price } from '@/models/price';
import { logger } from '@megp/core-fe';
import { Box } from '@mantine/core';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const { service, area } = useParams();

  const { data: list, isLoading, isError } = useListQuery();

  logger.log('list', list, isLoading, isError);

  const config: EntityConfig<Partial<Price>> = useMemo(() => {
    return {
      basePath: `/settings/pricing/${service}/${area}`,
      mode: 'list',
      entity: 'prices',
      primaryKey: 'id',
      title: `${service}`,
      onAdd: () => {
        logger.log('new');
        route.push(`/settings/pricing/${service}/${area}/new`);
      },
      onDetail: (selected: Price) => {
        logger.log('detail', selected);
        route.push(`/settings/pricing/${service}/${area}/${selected.id}`);
      },

      columns: [
        {
          id: 'name',
          header: 'Value From',
          accessorKey: 'valueFrom',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'valueTo',
          header: 'Value To',
          accessorKey: 'valueTo',
          cell: (info) => info.getValue(),
        },
        {
          id: 'fee',
          header: 'Fee',
          accessorKey: 'fee',
          cell: (info) => info.getValue(),
        },
        {
          id: 'currency',
          header: 'Currency',
          accessorKey: 'currency',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();
  const pathRegex = /^\/settings\/pricing\/[^/]+\/[^/]+$/;
  const detailRegex = /^\/settings\/pricing\/[^/]+\/[^/]+\/new$/;

  const mode = pathRegex.test(pathname)
    ? 'list'
    : detailRegex.test(pathname)
    ? 'new'
    : 'detail';

  logger.log('mode', mode, pathname);
  return (
    <Box className="w-full">
      <EntityLayout
        mode={mode}
        config={config}
        data={list?.items ?? []}
        detail={children}
      />
    </Box>
  );
}
