'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useListByIdQuery } from './_api/procurement-procedures.api';
import { ProcurementProcedure } from '@/models/procurement-procedures';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const { user } = useAuth();

  const pathname = usePathname();

  const { isLoading } = useListByIdQuery({
    id: user?.organization?.id,
    collectionQuery: undefined,
  });

  useEffect;
  const config: EntityConfig<ProcurementProcedure> = useMemo(() => {
    return {
      basePath: '/lookup/procurement-procedures',
      mode: 'list',
      entity: 'Procurement Procedure',
      primaryKey: 'id',
      title: 'Procurement Procedure',
      onAdd: () => {
        route.push(`/lookup/procurement-procedures/new`);
      },
      onDetail: (selected: ProcurementProcedure) => {
        route.push(`/lookup/procurement-procedures/${selected?.id}`);
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
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);
  const data = [
    {
      id: '607d37b5-f303-44ea-bf7e-f67fa3d64b4b',
      name: 'Procurement Procedure 1',
      description: 'Procurement Procedure 1',
    },
    {
      id: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      name: 'Procurement Procedure 1',
      description: 'Procurement Procedure 1',
    },
    {
      id: '15272d4f-d78f-4c58-8e93-ff436a815219',
      name: 'Procurement Procedure 1',
      description: 'Procurement Procedure 1',
    },
  ];

  const mode =
    pathname === `/lookup/procurement-procedures`
      ? 'list'
      : pathname === `/lookup/procurement-procedures/new`
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
