import { ActionIcon, Button, Text, TextInput } from '@mantine/core';
import { Select } from '@mantine/core';
import { Stack } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import React from 'react';
import { Table } from '../../../../../_shared/components';

interface Props {
  form: any;
}

export const ShareHolders: React.FC<Props> = ({ form }) => {
  return (
    <>
      <Stack my={15}>
        <Table
          tableType={'editable'}
          columns={[
            {
              name: 'Full Name',
              render: (index) => (
                <Stack my={15}>
                  <TextInput
                    label="Full Name"
                    name="fullName"
                    id="fullName"
                    {...form.getInputProps(
                      `shareHolders.shareHoldersTable.${index}.fullName`,
                    )}
                  />
                </Stack>
              ),
            },
            {
              name: 'Nationality',
              render: (index) => (
                <Stack my={15}>
                  <Select
                    label="Nationality"
                    id="nationality"
                    data={['USD', 'ETB', 'EUR', 'GBP']}
                    placeholder="select"
                    searchable
                    nothingFound="No options"
                    {...form.getInputProps(
                      `shareHolders.shareHoldersTable.${index}.nationality`,
                    )}
                  />
                </Stack>
              ),
            },
            {
              name: 'Share %',
              render: (index) => (
                <Stack my={15}>
                  <TextInput
                    label="Share %"
                    name="share"
                    id="share"
                    {...form.getInputProps(
                      `shareHolders.shareHoldersTable.${index}.share`,
                    )}
                  />
                </Stack>
              ),
            },
            {
              name: 'Action',
              render: (index) => (
                <ActionIcon
                  color="red"
                  onClick={() =>
                    form.removeListItem('shareHolders.shareHoldersTable', index)
                  }
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              ),
            },
          ]}
          data={form.values.shareHolders.shareHoldersTable}
          title={<Text>Table</Text>}
          titlePosition={'start'}
          addcolumn={
            <Button
              onClick={() =>
                form.insertListItem('shareHolders.shareHoldersTable', {
                  fullName: '',
                  nationality: '',
                  share: '',
                  key: randomId(),
                })
              }
              variant="outline"
            >
              Add
            </Button>
          }
          horizontalSpacing="sm"
          verticalSpacing="sm"
          fontSize="xs"
          striped
          highlightOnHover
          withBorder
          withColumnBorders
        />
      </Stack>
    </>
  );
};
