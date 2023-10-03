'use client';
import { Group } from '@/models/group';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

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

  return (
    <EntityLayout mode={mode} config={config} data={data} detail={children} />
  );
}
