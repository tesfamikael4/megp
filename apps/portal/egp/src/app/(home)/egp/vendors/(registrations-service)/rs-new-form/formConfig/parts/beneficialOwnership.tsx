import { ActionIcon, Button, Select, Text } from '@mantine/core';
import { Stack, TextInput } from '@mantine/core';
import { IconTrash, IconUserSquareRounded } from '@tabler/icons-react';
import React from 'react';
import { Table } from '../../../../_shared/components';
import { randomId } from '@mantine/hooks';

interface Props {
  form: any;
}
export const BeneficialOwnership: React.FC<Props> = ({ form }) => {
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
                    icon={<IconUserSquareRounded size={'1rem'} />}
                    id="fullName"
                    {...form.getInputProps(
                      `beneficialOwnership.shareHoldersTable.${index}.fullName`,
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
                    data={['Ethiopian', 'Services', 'Works']}
                    placeholder="select"
                    searchable
                    nothingFound="No options"
                    {...form.getInputProps(
                      `beneficialOwnership.shareHoldersTable.${index}.nationality`,
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
                    form.removeListItem(
                      'beneficialOwnership.shareHoldersTable',
                      index,
                    )
                  }
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              ),
            },
          ]}
          data={form.values.beneficialOwnership.shareHoldersTable}
          title={<Text>Table</Text>}
          titlePosition={'start'}
          addcolumn={
            <Button
              onClick={() =>
                form.insertListItem('beneficialOwnership.shareHoldersTable', {
                  fullName: '',
                  nationality: '',
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
