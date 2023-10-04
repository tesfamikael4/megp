import { ActionIcon, Button, Card, Flex, Select, Text } from '@mantine/core';
import { Stack, TextInput } from '@mantine/core';
import {
  IconMenu,
  IconPencil,
  IconPlus,
  IconTrash,
  IconUserSquareRounded,
} from '@tabler/icons-react';
import React from 'react';
import { Table } from '../../../../_shared/components';
import { randomId } from '@mantine/hooks';
import { nationalityOptions } from '../../../../_shared/config';
import CardList from '../../../../_shared/components/cardList';
import ActionMenu from '../../../../_shared/components/actionMenu';

interface Props {
  form: any;
}

export const BeneficialOwnership: React.FC<Props> = ({ form }) => {
  return (
    <>
      <Stack my={15}>
        <CardList
          formConfig={{
            form,
            dataLocation: 'beneficialOwnership.beneficialOwnershipTable',
            title: 'Add Beneficial',
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
                form.insertListItem(
                  'beneficialOwnership.beneficialOwnershipTable',
                  {
                    firstName: '',
                    lastName: '',
                    nationality: '',
                    key: randomId(),
                  },
                );
                openModal({
                  index:
                    form.values.beneficialOwnership.beneficialOwnershipTable
                      .length,
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
              {form.values.beneficialOwnership?.beneficialOwnershipTable.map(
                (value: any, index: number) => (
                  <Flex
                    key={index}
                    className="shadow-md p-4 rounded-md flex-col  w-[250px] border"
                  >
                    <div className=" text-lg font-[600]  truncate">
                      {value.firstName} {value.lastName}
                    </div>

                    <div className=" text-sm text-gray-500  w-[220px] mb-[1rem] truncate">
                      {' '}
                      Nationality: {value.nationality}
                    </div>
                    <Flex className=" justify-end border-t">
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
                                'beneficialOwnership.beneficialOwnershipTable',
                                index,
                              );
                              close();
                            },
                            icon: <IconTrash size={'1rem'} color="red" />,
                          },
                        ]}
                      />
                    </Flex>
                  </Flex>
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
                  `beneficialOwnership.beneficialOwnershipTable.${index}.firstName`,
                )}
                required
              />
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                {...form.getInputProps(
                  `beneficialOwnership.beneficialOwnershipTable.${index}.lastName`,
                )}
                required
              />
              <Select
                id="nationality"
                label="Nationality"
                data={nationalityOptions}
                placeholder="select"
                searchable
                {...form.getInputProps(
                  `beneficialOwnership.beneficialOwnershipTable.${index}.nationality`,
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
                    'beneficialOwnership.beneficialOwnershipTable',
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
