import React from 'react';
import { Text, TextInput, Group, Stack } from '@mantine/core';
import { Select } from '@mantine/core';
import { PassFormDataProps } from './formShell';
import {
  CardListShell,
  SingleCardWrapper,
} from '../../../../_components/cardList/cardListShell';
import { getNationalityValues } from '../../../../registration/new/_components/mockup/nationality';

interface Props extends Partial<PassFormDataProps> {
  itemSchema: any;
  name: string;
}
export const BeneficialOwnership: React.FC<Props> = ({
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
        }}
        title="Beneficial Ownership List"
        itemSchema={itemSchema}
        disabled={false}
        modalBody={(getInputProps) => (
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
                data={getNationalityValues()}
                {...getInputProps('nationality', 'select')}
              />
            </Group>
          </Stack>
        )}
        card={(edit, remove) => (
          <>
            {control?._formValues?.beneficialOwnership.map(
              (value: any, index: number) => (
                <SingleCardWrapper
                  key={index}
                  edit={() => edit(index)}
                  remove={() => remove(index)}
                  disabled={false}
                >
                  <Stack gap={0}>
                    <Text fw={600} truncate>
                      {value.firstName} {value.lastName}
                    </Text>
                    <Text fz="xs" truncate>
                      Nationality: {value.nationality}
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
