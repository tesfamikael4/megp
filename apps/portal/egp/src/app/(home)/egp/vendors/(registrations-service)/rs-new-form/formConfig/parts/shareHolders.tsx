import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Text,
  TextInput,
  Group,
} from '@mantine/core';
import { Select } from '@mantine/core';
import { Stack } from '@mantine/core';
import React from 'react';
import { Table } from '../../../../_shared/components';
import CardList from '../../../../_shared/components/cardList';
import ActionMenu from '../../../../_shared/components/actionMenu';
import { IconMenu, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { randomId } from '@mantine/hooks';
import { nationalityOptions } from '@/app/(home)/egp/vendors/_shared/config';

interface Props {
  form: any;
}

export const ShareHolders: React.FC<Props> = ({ form }) => {
  return (
    <>
      <Stack my={15}>
        <CardList
          formConfig={{
            form,
            dataLocation: 'shareHolders.shareHoldersTable',
            title: 'Add Share Holders ',
          }}
          renderAddCard={(openModal) => (
            <Card
              shadow="xs"
              padding="lg"
              radius="md"
              w={250}
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
                form.insertListItem('shareHolders.shareHoldersTable', {
                  firstName: '',
                  lastName: '',
                  nationality: '',
                  share: '',
                  key: randomId(),
                });
                openModal({
                  index: form.values.shareHolders.shareHoldersTable.length,
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
              {form.values.shareHolders?.shareHoldersTable.map(
                (value: any, index: number) => (
                  <Card key={index} w={250}>
                    <Card.Section mb={10}></Card.Section>
                    <Text size="lg" style={{ marginBottom: '0.5rem' }}>
                      {value.firstName} {value.lastName}
                    </Text>
                    <Text
                      size="sm"
                      color="gray"
                      style={{ marginBottom: '0.5rem' }}
                      w={'220px'}
                      truncate
                    >
                      Nationality: {value.nationality}
                    </Text>

                    <Text
                      size="sm"
                      color="gray"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      share: %{value.share}
                    </Text>

                    <Card.Section mt={30}>
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
                                  'shareHolders.shareHoldersTable',
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
              <Stack my={7}>
                <TextInput
                  label="First Name"
                  placeholder="Enter first name"
                  {...form.getInputProps(
                    `shareHolders.shareHoldersTable.${index}.firstName`,
                  )}
                  required
                />{' '}
              </Stack>
              <Stack my={7}>
                <TextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  {...form.getInputProps(
                    `shareHolders.shareHoldersTable.${index}.lastName`,
                  )}
                  required
                />{' '}
              </Stack>
              <Stack my={7}>
                <Select
                  label="Nationality"
                  id="nationality"
                  data={nationalityOptions}
                  placeholder="select"
                  searchable
                  nothingFound="No options"
                  {...form.getInputProps(
                    `shareHolders.shareHoldersTable.${index}.nationality`,
                  )}
                />{' '}
              </Stack>
              <Stack my={7}>
                <TextInput
                  label="Share %"
                  name="share"
                  id="share"
                  {...form.getInputProps(
                    `shareHolders.shareHoldersTable.${index}.share`,
                  )}
                />
              </Stack>
            </>
          )}
          renderModalFormSaveButton={(validateModalForm) => (
            <Button onClick={() => validateModalForm()}>Save</Button>
          )}
          renderModalFormRemoveButton={(index, close, type) => (
            <Button
              onClick={() => {
                if (type == 'new') {
                  form.removeListItem('shareHolders.shareHoldersTable', index);
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
