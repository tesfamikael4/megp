import React from 'react';
import { Flex, Group, Stack, Text, TextInput } from '@mantine/core';
import { Select } from '@mantine/core';

import { IconMenu, IconPencil, IconTrash } from '@tabler/icons-react';
import { PassFormDataProps } from './formShell';
import {
  CardListShell,
  SingleCardWrapper,
} from '../../../../_components/cardList/cardListShell';
import ActionMenu from '../../../../_components/actionMenu';
import { nationalityOptions } from '../mockup/nationality';

interface Props extends Partial<PassFormDataProps> {
  itemSchema: any;
  name: string;
}
export const ShareHolders: React.FC<Props> = ({
  control,
  itemSchema,
  name,
}) => {
  return (
    <>
      <CardListShell
        name={name}
        control={control}
        initialValues={{
          firstName: '',
          lastName: '',
          nationality: '',
          share: '',
        }}
        title="Share Holders List"
        itemSchema={itemSchema}
        modalBody={(getInputProps) => (
          <>
            <Stack>
              <Group grow>
                <TextInput
                  label="First Name"
                  placeholder="Enter first name"
                  required
                  {...getInputProps('firstName')}
                />
                <TextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  required
                  {...getInputProps('lastName')}
                />
              </Group>
              <Group grow>
                <Select
                  label="Nationality"
                  searchable
                  data={nationalityOptions}
                  {...getInputProps('nationality', 'select')}
                />

                <TextInput
                  type="number"
                  label="Share"
                  placeholder="Enter Share"
                  {...getInputProps('share')}
                />
              </Group>
            </Stack>
          </>
        )}
        card={(edit, remove) => (
          <>
            {control?._formValues?.shareHolders.map(
              (value: any, index: number) => (
                <SingleCardWrapper
                  key={index}
                  edit={() => edit(index)}
                  remove={() => remove(index)}
                >
                  <Stack gap={0}>
                    <Text fw={600} truncate>
                      {value.firstName} {value.lastName}
                    </Text>
                    <Text fz="xs" truncate>
                      Nationality: {value.nationality}
                    </Text>
                    <Text fz="xs" truncate>
                      Share: {value.share}
                    </Text>
                  </Stack>
                </SingleCardWrapper>
              ),
            )}
          </>
        )}
      />
    </>
  );
};
