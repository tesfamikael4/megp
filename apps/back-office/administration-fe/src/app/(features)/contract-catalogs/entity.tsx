'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { logger } from '@megp/core-fe';
import { Contract } from '@/models/contract';
import { useLazyListQuery } from './_api/contract.api';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();
  const [trigger, { data }] = useLazyListQuery();

  const config: EntityConfig<Contract> = useMemo(() => {
    return {
      basePath: '/contract-catalogs',
      mode: 'list',
      entity: 'contract-catalogs',
      primaryKey: 'id',
      title: 'Contract Catalogs',
      hasAdd: true,
      pagination: true,
      searchable: true,
      sortable: true,
      onDetail: (selected: Contract) => {
        route.push(`/contract-catalogs/${selected.id}`);
      },
      onAdd: () => {
        route.push(`/contract-catalogs/new`);
      },

      onSearch: (search) => {
        logger.log('search', search);
      },

      columns: [
        {
          id: 'contractTitle',
          header: 'Contract Title',
          accessorKey: 'contractTitle',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

  const pathname = usePathname();

  const mode =
    pathname === `/contract-catalogs`
      ? 'list'
      : pathname === `/contract-catalogs/new`
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
