import {
  Badge,
  Button,
  Card,
  Flex,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import React from 'react';
import {
  IconBuildingBank,
  IconCash,
  IconMenu,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { Select } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import CardList from '../../../../_shared/components/cardList';
import ActionMenu from '../../../../_shared/components/actionMenu';

interface Props {
  form: any;
}

export const BankAccountDetails: React.FC<Props> = ({ form }) => {
  return (
    <>
      <Stack my={15}>
        <CardList
          formConfig={{
            form,
            dataLocation: 'bankAccountDetails.bankAccountDetailsTable',
            title: 'Add Bank Information',
          }}
          renderAddCard={(openModal) => (
            <Card
              shadow="xs"
              padding="lg"
              radius="md"
              withBorder
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
                  'bankAccountDetails.bankAccountDetailsTable',
                  {
                    firstName: '',
                    lastName: '',
                    email: '',
                    mobileNumber: '',
                    key: randomId(),
                  },
                );
                openModal({
                  index:
                    form.values.bankAccountDetails.bankAccountDetailsTable
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
              {form.values.bankAccountDetails?.bankAccountDetailsTable.map(
                (value: any, index: number) => (
                  <Card
                    key={index}
                    withBorder
                    padding="md"
                    radius="md"
                    w={250}
                    shadow="sm"
                  >
                    <Card.Section mb={10}>
                      <Group position="apart" p={10}>
                        <div></div>
                        <Badge c="green">{value.status}</Badge>
                      </Group>
                    </Card.Section>

                    <Text
                      weight={700}
                      size="lg"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      {value.bankName}
                    </Text>
                    <Text
                      size="sm"
                      color="gray"
                      style={{ marginBottom: '0.5rem' }}
                      w={'200px'}
                      truncate
                    >
                      Bank Branch Address: {value.bankBranchAddress}
                    </Text>
                    <Text
                      size="sm"
                      color="gray"
                      style={{ marginBottom: '0.5rem' }}
                      w={'200px'}
                      truncate
                    >
                      AccountNumber: {value.accountNumber}
                    </Text>
                    <Text
                      size="sm"
                      color="gray"
                      style={{ marginBottom: '0.5rem' }}
                      w={'200px'}
                      truncate
                    >
                      Account Holders FullName: {value.accountHoldersFullName}
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
                                  'bankAccountDetails.bankAccountDetailsTable',
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
                label="Account Holder Full Name"
                id="accountHoldersFullName"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.accountHoldersFullName`,
                )}
              />
              <NumberInput
                label="Account Number"
                id="accountNumber"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.accountNumber`,
                )}
              />
              <Select
                label="Bank Name"
                id="bankName"
                icon={<IconBuildingBank size="1rem" />}
                data={[
                  'CDH Investment Bank',
                  'Ecobank Malawi',
                  'FDH Bank',
                  'First Capital Bank Malawi Limited',
                  'National Bank of Malawi',
                  'NBS Bank',
                  'Standard Bank Malawi',
                  'Standard Bank Malawi',
                ]}
                placeholder="select"
                searchable
                nothingFound="No options"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.bankName`,
                )}
              />
              <TextInput
                label="Branch Name"
                name="branchName"
                id="branchName"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.branchName`,
                )}
              />
              <Textarea
                label="Bank Branch Address"
                id="bankBranchAddress"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.bankBranchAddress`,
                )}
              />
              <Select
                label="Currency"
                id="currency"
                icon={<IconCash size="1rem" />}
                data={['Local', 'Foreign']}
                placeholder="select"
                searchable
                nothingFound="No options"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.currency`,
                )}
                className="w-[150px]"
              />
              <TextInput
                label="Bank SWIFT/BIC code"
                name="bankSWIFT_BICCode"
                id="bankSWIFT_BICCode"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.bankSWIFT_BICCode`,
                )}
              />
              <TextInput
                label="IBAN"
                name="iBAN"
                id="iBAN"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.iBAN`,
                )}
              />
              <Select
                label="Status"
                id="status"
                icon={<IconCash size="1rem" />}
                data={['Active', 'Inactive']}
                placeholder="select"
                searchable
                nothingFound="No options"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.status`,
                )}
              />
              <TextInput
                label="Hash Value"
                name="hashValue"
                id="hashValue"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.hashValue`,
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
                    'bankAccountDetails.bankAccountDetailsTable',
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
