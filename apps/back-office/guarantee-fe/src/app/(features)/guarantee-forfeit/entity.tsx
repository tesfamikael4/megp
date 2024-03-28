'use client';

import { GuaranteeForfeit } from '@/models/guarantee-forfeit';
import { useLazyGetGuranateeForfeitsQuery } from '@/store/api/guarantee-forfeit/guarantee-forfeit.api';
import { Box } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();

  const [trigger, { data, isLoading }] = useLazyGetGuranateeForfeitsQuery();

  const config: EntityConfig<Partial<GuaranteeForfeit>> = useMemo(() => {
    return {
      basePath: `/guarantee/guarantee-forfeit`,
      mode: 'list',
      entity: 'Guarantee Forfeits',
      primaryKey: 'id',
      primaryContent: 'description',
      title: `Guarantee Forfeits`,
      hasAdd: false,
      searchable: true,
      pagination: true,
      isLoading: isLoading,

      onDetail: (selected: GuaranteeForfeit) => {
        logger.log('detail', selected);
        route.push(`/guarantee/guarantee-forfeit/${selected?.id}`);
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
    pathname == '/guarantee-forfeit'
      ? 'list'
      : pathname == '/guarantee-forfeit/new'
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

  // useEffect(() => {
  //   if (guaranteeId) {
  //     const request: CollectionQuery = {
  //       where: [
  //         [
  //           {
  //             column: 'parentId',
  //             value: guaranteeId,
  //             operator: '=',
  //           },
  //         ],
  //       ],
  //     };
  //     trigger(guaranteeId);
  //   }
  // }, [guaranteeId]);

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
