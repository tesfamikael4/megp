'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { logger } from '@megp/core-fe';
import { Currency } from '@/models/currency';
import { useLazyListQuery } from './_api/procurement-thresholds.api';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();

  const config: EntityConfig<Currency> = useMemo(() => {
    return {
      basePath: '/procurement-thresholds',
      mode: 'list',
      entity: 'procurement-thresholds',
      primaryKey: 'id',
      title: 'Threshold',
      hasAdd: true,
      pagination: true,
      searchable: true,
      sortable: true,
      onDetail: (selected: Currency) => {
        route.push(`/procurement-thresholds/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/procurement-thresholds/new`);
      },

      onSearch: (search) => {
        logger.log('search', search);
      },

      columns: [
        {
          id: 'procurementType',
          header: 'Procurement Type',
          accessorKey: 'procurementType',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'minThreshold',
          header: 'Min Threshold',
          accessorKey: 'minThreshold',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'multiline',
          },
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname === `/procurement-thresholds`
      ? 'list'
      : pathname === `/procurement-threshold/new`
      ? 'new'
      : 'detail';
  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };

  return (
    <>
      <EntityLayout
        mode={mode}
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
        detail={children}
      />
    </>
  );
}
