import React from 'react';
import { TextInput, Group, Stack, Checkbox, NumberInput } from '@mantine/core';
import { Select } from '@mantine/core';
import { PassFormDataProps } from './formShell';
import { CardItem } from './contactPersons';
import { IconFlag, IconUser } from '@tabler/icons-react';
import {
  CardListShell,
  SingleCardWrapper,
} from '@/app/(features)/my-workspace/_components/cardList/cardListShell';
import { getNationalityValues } from '../../new/_components/mockup/nationality';
import { usePrivilege } from '../../new/_context/privilege-context';
import { IconPercentage } from '@tabler/icons-react';

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
          middleName: '',
          lastName: '',
          nationality: '',
          countryOfResidence: '',
          share: 0,
          votingRights: 0,
          authorityToAppointGov: false,
        }}
        title="Beneficial Ownership and Shareholders"
        itemSchema={itemSchema}
        disabled={disabled}
        modalBody={(getInputProps) => {
          return (
            <Stack>
              <Group grow>
                <TextInput
                  label="First Name"
                  placeholder="Enter first name"
                  withAsterisk
                  {...getInputProps('firstName')}
                />

                <TextInput
                  label="Middle Name"
                  placeholder="Enter Middle name"
                  {...getInputProps('middleName')}
                />
              </Group>
              <Group grow>
                <TextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  withAsterisk
                  {...getInputProps('lastName')}
                />
                <Select
                  label="Nationality of Ownership"
                  placeholder="Enter Nationality"
                  withAsterisk
                  searchable
                  data={getNationalityValues()}
                  {...getInputProps('nationality', 'select')}
                />
              </Group>
              <Group grow>
                <Select
                  label="Country of Residence"
                  placeholder="Enter Country of Residence"
                  data={getNationalityValues()}
                  withAsterisk
                  {...getInputProps('countryOfResidence', 'select')}
                />
                <NumberInput
                  label="Share in Percentage"
                  withAsterisk
                  hideControls
                  placeholder="Enter Share"
                  {...getInputProps('share', 'number')}
                  onChange={(value) => {
                    getInputProps('share', 'number').onChange(Number(value));
                  }}
                  min={1}
                  max={100}
                  suffix="%"
                />
              </Group>
              <Group grow>
                <NumberInput
                  label="Voting Rights in Percentage"
                  withAsterisk
                  hideControls
                  placeholder="Enter Voting Rights"
                  {...getInputProps('votingRights', 'number')}
                  onChange={(value) => {
                    getInputProps('votingRights', 'number').onChange(
                      Number(value),
                    );
                    const previousShareholderShare =
                      control?._formValues?.shareHolders.reduce(
                        (acc, shareholder) => (acc += shareholder.share),
                        0,
                      );
                    // if (previousShareholderShare > 100) {

                    // }
                  }}
                  min={1}
                  max={100}
                  suffix="%"
                />
                <Checkbox
                  label="Authority to Appoint Government Body"
                  placeholder="Enter Authority to Appoint Government Body"
                  {...getInputProps('authorityToAppointGov', 'checkbox')}
                  checked={
                    getInputProps('authorityToAppointGov', 'checkbox').value
                  }
                  onChange={(event) => {
                    getInputProps('authorityToAppointGov', 'checkbox').onChange(
                      event.currentTarget.checked,
                    );
                  }}
                />
              </Group>
            </Stack>
          );
        }}
        card={(edit, remove) => (
          <>
            {control?._formValues?.beneficialOwnershipShareholders.map(
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
                    <CardItem
                      label={value.share}
                      icon={
                        <IconPercentage
                          size={25}
                          stroke={1.5}
                          color={'green'}
                        />
                      }
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
