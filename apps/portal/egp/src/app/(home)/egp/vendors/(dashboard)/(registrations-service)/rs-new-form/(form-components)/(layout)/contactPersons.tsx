import React from 'react';
import {
  Card,
  Stack,
  TextInput,
  Group,
  Text,
  Flex,
  Button,
} from '@mantine/core';
import CardList from '../../../../../_shared/components/cardList';
import ActionMenu from '../../../../../_shared/components/actionMenu';
import { IconMenu, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { randomId } from '@mantine/hooks';

interface Props {
  form: any;
}
export const ContactPersons: React.FC<Props> = ({ form }) => {
  return (
    <>
      <Stack my={15}>
        <CardList
          formConfig={{
            form,
            dataLocation: 'contactPersons.contactPersonsTable',
            title: 'Add Contact',
          }}
          renderAddCard={(openModal) => (
            <Card
              shadow="xs"
              padding="lg"
              radius="md"
              withBorder
              w={200}
              style={{
                height: '100%',
                backgroundColor: '#f5f5f5',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
              onClick={() => {
                form.insertListItem('contactPersons.contactPersonsTable', {
                  firstName: '',
                  lastName: '',
                  email: '',
                  mobileNumber: '',
                  key: randomId(),
                });
                openModal({
                  index: form.values.contactPersons.contactPersonsTable.length,
                  value: {},
                  type: 'new',
                });
              }}
            >
              <Flex
                align={'center'}
                justify={'center'}
                className="w-20 h-20 border-4 rounded-full shadow-lg transition-transform hover:scale-105"
              >
                <IconPlus size={33} />
              </Flex>
            </Card>
          )}
          renderCardList={(openModal) => (
            <>
              {form.values.contactPersons.contactPersonsTable.map(
                (value: any, index: number) => (
                  <Card key={index} withBorder>
                    <Card.Section mb={10}>
                      <Group position="apart" p={10}>
                        <div></div>
                        {/* <Badge c="green">active</Badge> */}
                      </Group>
                    </Card.Section>
                    <Text
                      weight={700}
                      size="lg"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      {console.log(value)}
                      {value.firstName} {value.lastName}
                    </Text>
                    <Text
                      size="sm"
                      color="gray"
                      style={{ marginBottom: '0.5rem' }}
                      w={'160px'}
                      truncate
                    >
                      Email: {value.email}
                    </Text>

                    <Text
                      size="sm"
                      color="gray"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      Phone: {value.mobileNumber}
                    </Text>

                    <Card.Section mt={30} withBorder>
                      <Flex justify={'right'} py={3} px={10}>
                        <ActionMenu
                          renderOpenButton={() => <IconMenu size={'1rem'} />}
                          data={[
                            {
                              label: 'Edit',
                              action: () =>
                                openModal({
                                  index,
                                  value,
                                  type: 'edit',
                                }),
                              icon: <IconPencil size={'1rem'} />,
                            },
                            {
                              label: 'Delete',
                              action: () => {
                                form.removeListItem(
                                  'contactPersons.contactPersonsTable',
                                  index,
                                );
                                close();
                              },
                              icon: <IconTrash size={'1rem'} color="red" />,
                            },
                          ]}
                        />
                      </Flex>
                    </Card.Section>
                  </Card>
                ),
              )}
            </>
          )}
          renderModalForm={(index) => (
            <>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                {...form.getInputProps(
                  `contactPersons.contactPersonsTable.${index}.firstName`,
                )}
                required
              />
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                {...form.getInputProps(
                  `contactPersons.contactPersonsTable.${index}.lastName`,
                )}
                required
              />
              <TextInput
                label="Email"
                placeholder="Enter email"
                {...form.getInputProps(
                  `contactPersons.contactPersonsTable.${index}.email`,
                )}
                required
              />
              <TextInput
                label="Phone Number"
                placeholder="Enter phone number"
                {...form.getInputProps(
                  `contactPersons.contactPersonsTable.${index}.mobileNumber`,
                )}
              />
            </>
          )}
          renderModalFormSaveButton={(validateModalForm) => (
            <Button onClick={() => validateModalForm()}>Save</Button>
          )}
          renderModalFormRemoveButton={(index, close, type) => (
            <Button
              onClick={() => {
                if (type == 'new') {
                  form.removeListItem(
                    'contactPersons.contactPersonsTable',
                    index,
                  );
                }
                close();
              }}
            >
              Cancel
            </Button>
          )}
        />
      </Stack>
    </>
  );
};
