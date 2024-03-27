'use client';

import { Box } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useLazyListQuery } from './_api/guarantee-forfeit.api';
import { GuaranteeForfeit } from '@/models/guarantee-forfiet/guarantee-forfiet';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const data = [
    {
      id: '1',
      economicOperatorName: 'economicOperatorName',
      procurementTitle: 'procurementTitle',
      procuringEntityName: 'procuringEntityName',
      type: 'type',
      status: 'status',
    },
  ];
  // const { data: list, isLoading, isError } = useListQuery({});
  const [getRequest, { data: list, isLoading, isError }] = useLazyListQuery({});

  logger.log('list', list, isLoading, isError);

  const config: EntityConfig<Partial<GuaranteeForfeit>> = useMemo(() => {
    return {
      basePath: `/guarantee`,
      mode: 'list',
      entity: 'Guarantee Forfeits',
      primaryKey: 'id',
      primaryContent: 'description',
      title: `Guarantee Forfeits`,
      hasAdd: false,
      searchable: true,
      pagination: true,

      onDetail: (selected: GuaranteeForfeit) => {
        logger.log('detail', selected);
        route.push(`/guarantee-forfeit/${selected.id}`);
      },

      columns: [
        {
          id: 'economicOperatorName',
          header: 'Economic Operator Name',
          accessorKey: 'economicOperatorName',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },

        {
          id: 'procurementTitle',
          header: 'Procurement Title',
          accessorKey: 'procurementTitle',
          meta: {
            widget: 'expand',
          },
          cell: (info) => info.getValue(),
        },
        {
          id: 'procuringEntityName',
          header: 'Procuring Entity Name ',
          accessorKey: 'procuringEntityName',
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
    pathname == '/guarantee-forfeit'
      ? 'list'
      : pathname == '/guarantee-forfeit/new'
        ? 'new'
        : 'detail';

  logger.log('mode', mode, pathname);

  const onRequestChange = (collectionQuery) => {
    getRequest(collectionQuery);
  };

  return (
    <Box className="w-full">
      <EntityLayout
        mode={mode}
        config={config}
        onRequestChange={onRequestChange}
        total={list?.total ?? 0}
        // data={list?.items ?? []}
        data={data}
        detail={children}
      />
    </Box>
  );
}
