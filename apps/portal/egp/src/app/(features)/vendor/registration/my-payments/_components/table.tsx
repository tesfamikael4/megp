'use client';

import {
  ActionIcon,
  Box,
  Button,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { closeModal, openModal } from '@mantine/modals';
import { IconDotsVertical } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';

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

const showModal = ({
  company,
  action,
}: {
  company: Company;
  action: string;
}) => {
  openModal({
    title: 'Row action',
    children: (
      <Stack>
        <Text>
          <Text w={700}>{company.name}</Text>
        </Text>
        <Grid>
          <GridCol span={6}>
            <Button
              fullWidth
              onClick={() => closeModal('close')}
              variant="outline"
              color="gray"
            >
              Close
            </Button>
          </GridCol>
        </Grid>
      </Stack>
    ),
    size: 'sm',
  });
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
          render: (company) => (
            <Group gap={4} justify="right" wrap="nowrap">
              <ActionIcon
                size="sm"
                variant="subtle"
                color="green"
                // ml={'md'}
                onClick={() => showModal({ company, action: 'view' })}
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Group>
          ),
        },
      ]}
      records={records}
      styles={{
        header: {
          backgroundColor: '#E8E8E8',
        },
      }}
    />
  );
}
