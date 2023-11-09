'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useReadQuery, useListQuery } from './_api/group.api';
import { Group } from '@/models/group';
import { logger } from '@megp/core-fe';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();

  const { data: list, isLoading } = useListQuery();

  const {
    data: selected,
    isLoading: selectedLoading,
    isError: selectedError,
  } = useReadQuery('id');

  logger.log('selected', selected, selectedLoading, selectedError);

  const config: EntityConfig<Group> = useMemo(() => {
    return {
      basePath: '/groups',
      mode: 'list',
      entity: 'groups',
      primaryKey: 'id',
      title: 'Groups',
      onAdd: () => {
        route.push(`/groups/new`);
      },
      onDetail: (selected: Group) => {
        route.push(`/groups/${selected.id}`);
      },
      pagination: true,
      searchable: true,
      sortable: true,
      onSearch: (search) => {
        logger.log('search', search);
      },

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

  const pathname = usePathname();

  const mode =
    pathname === `/groups`
      ? 'list'
      : pathname === `/groups/new`
      ? 'new'
      : 'detail';

  return (
    <>
      <EntityLayout
        mode={mode}
        config={config}
        data={list?.items ? list.items : []}
        detail={children}
        isLoading={isLoading}
      />
    </>
  );
}
