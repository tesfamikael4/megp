import React from 'react';
import { TextInput, Stack, Group, Text } from '@mantine/core';
import {
  CardListShell,
  SingleCardWrapper,
} from '../../../../_components/cardList/cardListShell';
import { PassFormDataProps } from './formShell';

interface Props extends Partial<PassFormDataProps> {
  itemSchema: any;
  name: string;
}
export const ContactPersons: React.FC<Props> = ({
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
          email: '',
          mobileNumber: '',
        }}
        title="Contact Persons"
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
              <TextInput
                label="Email"
                placeholder="Enter email"
                required
                {...getInputProps('email')}
              />

              <TextInput
                label="Phone Number"
                placeholder="Enter phone number"
                required
                withAsterisk
                {...getInputProps('mobileNumber')}
              />
            </Group>
          </Stack>
        )}
        card={(edit, remove) => (
          <>
            {control?._formValues?.contactPersons.map(
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
                      Email: {value.email}
                    </Text>
                    <Text fz="xs" truncate>
                      Phone: {value.mobileNumber}
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
