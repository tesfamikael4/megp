import React from 'react';
import { TextInput, Group, Stack } from '@mantine/core';
import { Select } from '@mantine/core';
import { PassFormDataProps } from './formShell';
import { CardItem } from './contactPersons';
import { IconFlag, IconUser } from '@tabler/icons-react';
import {
  CardListShell,
  SingleCardWrapper,
} from '@/app/(features)/vendor/_components/cardList/cardListShell';
import { getNationalityValues } from '../../new/_components/mockup/nationality';
import { usePrivilege } from '../../new/_context/privilege-context';

interface Props extends Partial<PassFormDataProps> {
  itemSchema: any;
  name: string;
  disabled: boolean;
}
export const BeneficialOwnership: React.FC<Props> = ({
  control,
  itemSchema,
  name,
  disabled,
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
        title="Beneficial Ownership"
        itemSchema={itemSchema}
        disabled={disabled}
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
                  disabled={disabled}
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
