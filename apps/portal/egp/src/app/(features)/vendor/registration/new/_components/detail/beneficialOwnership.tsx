import React from 'react';
import { Text, TextInput, Group, Stack } from '@mantine/core';
import { Select } from '@mantine/core';
import { PassFormDataProps } from './formShell';
import {
  CardListShell,
  SingleCardWrapper,
} from '../../../../_components/cardList/cardListShell';
import {
  getNationalityValues,
  nationalityOptions,
} from '../mockup/nationality';
import { usePrivilege } from '../../_context/privilege-context';
import { CardItem } from './contactPersons';
import { IconFlag, IconUser } from '@tabler/icons-react';

interface Props extends Partial<PassFormDataProps> {
  itemSchema: any;
  name: string;
}
export const BeneficialOwnership: React.FC<Props> = ({
  control,
  itemSchema,
  name,
}) => {
  const { checkAccess } = usePrivilege();

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
        title="Beneficial Ownership"
        itemSchema={itemSchema}
        disabled={!checkAccess('detail')}
        modalBody={(getInputProps) => (
          <Stack>
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                withAsterisk
                {...getInputProps('firstName')}
              />

              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                withAsterisk
                {...getInputProps('lastName')}
              />
            </Group>
            <Group grow>
              <Select
                label="Nationality"
                withAsterisk
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
                  disabled={!checkAccess('detail')}
                >
                  <Stack gap={0}>
                    <CardItem
                      label={value.firstName + ' ' + value.lastName}
                      icon={<IconUser size={25} stroke={1.5} color={'green'} />}
                      bold
                    />

                    <CardItem
                      label={value.nationality}
                      icon={<IconFlag size={25} stroke={1.5} color={'green'} />}
                    />
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
