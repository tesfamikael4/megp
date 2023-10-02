'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useReadQuery, useListQuery } from './_api/group.api';
import { Group } from '@/models/group';
import { logger } from '@megp/core-fe';

export function Entity({ children }: { children: React.ReactElement }) {
  const route = useRouter();

  const { data: list, isLoading, isError } = useListQuery();

  logger.log('list', list, isLoading, isError);

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
        logger.log('new');
        route.push(`/groups/new`);
      },
      onDetail: (selected: Group) => {
        logger.log('detail', selected);
        route.push(`/groups/${selected.id}`);
      },

      onSearch: (search) => {
        logger.log('search', search);
      },
      selectable: true,
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
          meta: {
            widget: 'multiline',
          },
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

  const data = [
    {
      id: '1',
      name: 'Group 1',
      description: 'Group 1 description',
    },
    { id: '2', name: 'Group 2', description: 'Group 2 description' },
    { id: '3', name: 'Group 3', description: 'Group 3 description' },
    { id: '4', name: 'Group 4', description: 'Group 4 description' },
    { id: '4', name: 'Group 4', description: 'Group 4 description' },
    { id: '4', name: 'Group 4', description: 'Group 4 description' },
    { id: '4', name: 'Group 4', description: 'Group 4 description' },
    { id: '4', name: 'Group 4', description: 'Group 4 description' },
    { id: '4', name: 'Group 4', description: 'Group 4 description' },
    {
      id: '4',
      name: 'Group 4',
      description:
        'Group 4 descripti Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sed laborum eos aperiam hic nobis odio minus corrupti recusandae perferendis numquam harum vitae aliquid sapiente ab. Illo id obcaecati dolorem.on',
    },
    { id: '4', name: 'Group 4', description: 'Group 4 description' },
    { id: '4', name: 'Group 4', description: 'Group 4 description' },
    { id: '4', name: 'Group 4', description: 'Group 4 description' },
    { id: '4', name: 'Group 4', description: 'Group 4 description' },
    { id: '55', name: 'Group 5', description: 'Group 4 description' },
  ];

  logger.log('mode', mode, pathname);
  return (
    <EntityLayout mode={mode} config={config} data={data} detail={children} />
  );
}
