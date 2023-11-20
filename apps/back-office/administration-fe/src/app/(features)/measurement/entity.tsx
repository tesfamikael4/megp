'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useListQuery } from './_api/measurement.api';
import { Measurement } from '@/models/measurement';
import { logger } from '@megp/core-fe';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const { data: list } = useListQuery({});

  const config: EntityConfig<Measurement> = useMemo(() => {
    return {
      basePath: '/measurements',
      mode: 'list',
      entity: 'measurements',
      primaryKey: 'id',
      title: 'Measurements',
      onDetail: (selected: Measurement) => {
        route.push(`/measurement/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/measurement/new`);
      },

      onSearch: (search) => {
        logger.log('search', search);
      },

      columns: [
        {
          id: 'shortName',
          header: 'Abbreviations',
          accessorKey: 'shortName',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
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
    pathname === `/measurement`
      ? 'list'
      : pathname === `/measurement/new`
      ? 'new'
      : 'detail';

  return (
    <>
      <EntityLayout
        mode={mode}
        config={config}
        data={list?.items ? list.items : []}
        detail={children}
      />
    </>
  );
}
