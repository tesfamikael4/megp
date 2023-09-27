import { ActionIcon, Button, Select, Text } from '@mantine/core';
import { Stack, TextInput } from '@mantine/core';
import { IconTrash, IconUserSquareRounded } from '@tabler/icons-react';
import React from 'react';
import { Table } from '../../../../_shared/components';
import { randomId } from '@mantine/hooks';
import { nationalityOptions } from '../../../../_shared/config';

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
              name: 'First Name',
              render: (index) => (
                <Stack my={15}>
                  <TextInput
                    icon={<IconUserSquareRounded size={'1rem'} />}
                    id="firstName"
                    {...form.getInputProps(
                      `beneficialOwnership.beneficialOwnershipTable.${index}.firstName`,
                    )}
                  />
                </Stack>
              ),
            },
            {
              name: 'Last Name',
              render: (index) => (
                <Stack my={15}>
                  <TextInput
                    icon={<IconUserSquareRounded size={'1rem'} />}
                    id="lastName"
                    {...form.getInputProps(
                      `beneficialOwnership.beneficialOwnershipTable.${index}.lastName`,
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
                    id="nationality"
                    data={nationalityOptions}
                    placeholder="select"
                    searchable
                    nothingFound="No options"
                    {...form.getInputProps(
                      `beneficialOwnership.beneficialOwnershipTable.${index}.nationality`,
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
                      'beneficialOwnership.beneficialOwnershipTable',
                      index,
                    )
                  }
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              ),
            },
          ]}
          data={
            form.values.beneficialOwnership
              ? form.values.beneficialOwnership.beneficialOwnershipTable
              : []
          }
          title={<Text>Table</Text>}
          titlePosition={'start'}
          addcolumn={
            <Button
              onClick={() =>
                form.insertListItem(
                  'beneficialOwnership.beneficialOwnershipTable',
                  {
                    firstName: '',
                    lastName: '',
                    nationality: '',
                    key: randomId(),
                  },
                )
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
