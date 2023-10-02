'use client';
import { Stack } from '@mantine/core';
import { Section, logger } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import { Relation, RelationConfig } from '@megp/entity';
import { User } from '@/models/user/user';
import { notifications } from '@mantine/notifications';

export default function GroupPage() {
  const relationConfig: RelationConfig<User> = {
    title: 'Users',
    columns: [
      {
        id: 'firstName',
        header: 'First name',
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
      {
        id: 'lastName',
        header: 'Last name',
        accessorKey: 'lastName',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'multiline',
        },
      },
    ],
    onSave: (selected) => {
      notifications.show({
        title: 'Default notification',
        message: 'Hey there, your code is awesome! 🤥',
      });
      logger.log('relation save', selected);
    },
  };

  const data = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      status: 'Active',
      isActive: true,
      organizationId: 'org123',
    },
    {
      id: '2',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      username: 'alicesmith',
      status: 'Inactive',
      isActive: false,
      organizationId: 'org456',
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      username: 'bobjohnson',
      status: 'Active',
      isActive: true,
      organizationId: 'org789',
    },
  ];

  return (
    <Stack>
      <Section title="Group Detail">
        <FormDetail mode="detail" />
      </Section>
      <Relation config={relationConfig} data={data} />
    </Stack>
  );
}
