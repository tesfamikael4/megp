'use client';
import { EntityConfig, EntityLayout } from '@megp/core-fe';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useReadQuery, useListQuery } from './_api/group.api';
import { Group } from '@/models/group';

export function Entity({ children }) {
  const route = useRouter();

  const { data: list, isLoading, isError } = useListQuery();

  console.log('list', list, isLoading, isError);

  const {
    data: selected,
    isLoading: selectedLoading,
    isError: selectedError,
  } = useReadQuery('id');

  console.log('selected', selected, selectedLoading, selectedError);

  const config: EntityConfig<Group> = useMemo(() => {
    return {
      basePath: '/groups',
      mode: 'list',
      entity: 'groups',
      primaryKey: 'id',
      title: 'Groups',
      onAdd: () => {
        console.log('new');
        route.push(`/groups/new`);
      },
      onDetail: (selected: Group) => {
        console.log('detail', selected);
        route.push(`/groups/${selected.id}`);
      },

      onSearch: (search) => {
        console.log('search', search);
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

  console.log('mode', mode, pathname);
  return (
    <EntityLayout mode={mode} config={config} data={data} detail={children} />
  );
}
