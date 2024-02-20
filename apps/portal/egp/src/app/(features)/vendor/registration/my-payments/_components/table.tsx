'use client';

import { ActionIcon, Box, Menu, rem } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import classes from './table.module.scss';
const companies = [
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Feest, Bogan and Herzog',
    streetAddress: '21716 Ratke Drive',
    city: 'Stromanport',
    state: 'WY',
    missionStatement: 'Innovate bricks-and-clicks metrics.',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Feest, Bogan and Herzog',
    streetAddress: '21716 Ratke Drive',
    city: 'Stromanport',
    state: 'WY',
    missionStatement: 'Innovate bricks-and-clicks metrics.',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Feest, Bogan and Herzog',
    streetAddress: '21716 Ratke Drive',
    city: 'Stromanport',
    state: 'WY',
    missionStatement: 'Innovate bricks-and-clicks metrics.',
  },
];

const records = companies.slice(0, 5);

export type Company = {
  id: string;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  missionStatement: string;
};

export default function Table() {
  return (
    <DataTable
      striped
      verticalSpacing="sm"
      withTableBorder
      columns={[
        { accessor: 'name' },
        { accessor: 'city' },
        { accessor: 'state' },
        {
          accessor: 'actions',
          title: <Box mr={6}>Row actions</Box>,
          textAlign: 'right',
          render: () => (
            <Menu shadow="md" width={100}>
              <Menu.Target>
                <ActionIcon right={32} size="sm" variant="subtle" color="green">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Divider />
                <Menu.Item
                  leftSection={
                    <IconEdit style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ),
        },
      ]}
      records={records}
      styles={{
        header: {
          backgroundColor: '#E8E8E8',
        },
      }}
      classNames={{ table: classes.table }}
    />
  );
}
