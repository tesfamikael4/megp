import React from 'react';
import { TextInput, Stack, Group, Text, Flex } from '@mantine/core';
import {
  CardListShell,
  SingleCardWrapper,
} from '../../../../_components/cardList/cardListShell';
import { PassFormDataProps } from './formShell';
import { usePrivilege } from '../../_context/privilege-context';
import { IconMail, IconPhone, IconUser } from '@tabler/icons-react';

interface Props extends Partial<PassFormDataProps> {
  itemSchema: any;
  name: string;
}
export const ContactPersons: React.FC<Props> = ({
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
          email: '',
          mobileNumber: '',
        }}
        title="Contact Persons"
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
              <TextInput
                label="Email"
                placeholder="Enter email"
                withAsterisk
                {...getInputProps('email')}
              />

              <TextInput
                label="Phone Number"
                placeholder="Enter phone number"
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
                  disabled={!checkAccess('detail')}
                >
                  <Stack gap={0}>
                    <CardItem
                      label={value.firstName + ' ' + value.lastName}
                      icon={<IconUser size={25} stroke={1.5} color={'green'} />}
                      bold
                    />
                    <CardItem
                      label={value.email}
                      icon={<IconMail size={25} stroke={1.5} color={'green'} />}
                    />
                    <CardItem
                      label={value.mobileNumber}
                      icon={
                        <IconPhone size={25} stroke={1.5} color={'green'} />
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

export const CardItem = ({ label, icon, bold }: any) => {
  return (
    <Flex align={'center'} gap={'sm'} className="mb-1 ">
      {icon}
      <Text size={'sm'} fw={bold ? 500 : 400}>
        {label}
      </Text>
    </Flex>
  );
};
