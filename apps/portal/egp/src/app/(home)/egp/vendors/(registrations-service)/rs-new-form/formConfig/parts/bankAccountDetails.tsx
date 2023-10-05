import {
  Badge,
  Button,
  Card,
  Flex,
  Group,
  LoadingOverlay,
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
import { useGetBankListQuery } from '@/store/api/vendor_registration/query';
import { getLabelByValue } from '../../../../_shared/lib/objectParser/object';

interface Props {
  form: any;
}

export const BankAccountDetails: React.FC<Props> = ({ form }) => {
  const { data, isLoading, isSuccess, status } = useGetBankListQuery({});

  const bankList =
    status === 'fulfilled' && data && data.length
      ? data.map((val) => ({
          value: val.id,
          label: val.bankName,
        }))
      : [];

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
            <Flex
              className="shadow-md p-10 text-center rounded-md flex-col items-center justify-center w-[250px] border "
              onClick={() => {
                form.insertListItem(
                  'bankAccountDetails.bankAccountDetailsTable',
                  {
                    accountHoldersFullName: '',
                    accountNumber: '',
                    bankBranchAddress: '',
                    currency: '',
                    bankSWIFT_BICCode: '',
                    iBAN: '',
                    status: '',
                    bankId: '',
                    bankName: '',
                    hashValue: randomId(),
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
            </Flex>
          )}
          renderCardList={(openModal) => (
            <>
              {form.values.bankAccountDetails?.bankAccountDetailsTable.map(
                (value: any, index: number) => (
                  <Flex
                    key={index}
                    className="shadow-md p-4 rounded-md flex-col  w-[250px] border"
                  >
                    <Text size="lg" className="font-[700] mb[0.5rem]">
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
                  </Flex>
                ),
              )}
            </>
          )}
          renderModalForm={(index) => (
            <Card>
              <LoadingOverlay
                visible={isLoading}
                overlayProps={{ radius: 'sm', blur: 2 }}
              />
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
                data={bankList}
                placeholder="select"
                searchable
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.bankId`,
                )}
                onChange={(val) => {
                  form.setFieldValue(
                    `bankAccountDetails.bankAccountDetailsTable.${index}.bankId`,
                    val,
                  );
                  form.setFieldValue(
                    `bankAccountDetails.bankAccountDetailsTable.${index}.bankName`,
                    getLabelByValue(bankList, val as string),
                  );
                }}
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
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.status`,
                )}
                disabled
              />
              <TextInput
                label="Hash Value"
                name="hashValue"
                id="hashValue"
                {...form.getInputProps(
                  `bankAccountDetails.bankAccountDetailsTable.${index}.hashValue`,
                )}
                disabled
              />
            </Card>
          )}
          renderModalFormSaveButton={(validateModalForm) => (
            <Button
              disabled={isLoading ? true : false}
              onClick={() => validateModalForm()}
            >
              Save
            </Button>
          )}
          renderModalFormRemoveButton={(index, close, type) => (
            <Button
              disabled={isLoading ? true : false}
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
