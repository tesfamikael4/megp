'use client';

import { ActionIcon, Badge, Box, Menu, rem } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import classes from './table.module.scss';

const companies = [
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    tenderName: 'Feest, Bogan and Herzog',
    refNo: '100000234496',
    amount: 'Stromanport',
    status: 'PAID',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    tenderName: 'Perago Test',
    refNo: '100000234567',
    amount: 'Stromanport',
    status: 'REJECTED',
  },
];

const records = companies.slice(0, 5);

export type Company = {
  id: string;
  tenderName: string;
  refNo: string;
  amount: string;
  status: string;
};

export default function Table() {
  return (
    <DataTable
      striped
      verticalSpacing="sm"
      withTableBorder
      columns={[
        { accessor: 'tenderName' },
        { accessor: 'refNo' },
        { accessor: 'amount' },
        {
          accessor: 'status',
          render: ({ status }) => (
            <Badge
              color={status === 'PAID' ? 'green' : 'red'}
              variant="light"
              fw={700}
              radius={'sm'}
            >
              {status}
            </Badge>
          ),
        },
        {
          accessor: 'actions',
          title: <Box mr={6}>Action</Box>,
          render: () => (
            <Menu shadow="md" width={100}>
              <Menu.Target>
                <ActionIcon
                  left={14}
                  size="sm"
                  variant="transparent"
                  color="#3D556A"
                >
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
      classNames={{ table: classes.table, header: classes.header }}
    />
  );
}
