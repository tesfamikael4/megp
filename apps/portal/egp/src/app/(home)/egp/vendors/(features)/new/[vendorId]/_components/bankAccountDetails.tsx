import { Flex, LoadingOverlay, TextInput, Textarea } from '@mantine/core';
import React from 'react';
import {
  IconBuildingBank,
  IconCash,
  IconMenu,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { Select } from '@mantine/core';
import { useGetBankListQuery } from '@/store/api/vendor_registration/query';
import { PassFormDataProps } from './formShell';
import CardList from '../../../../_components/cardList';
import ActionMenu from '../../../../_components/actionMenu';

interface Props extends Partial<PassFormDataProps> {
  itemSchema: any;
  name: string;
}

export const BankAccountDetails: React.FC<Props> = ({
  control,
  itemSchema,
  name,
}) => {
  const { data, isLoading, isSuccess, status } = useGetBankListQuery({});

  const bankList =
    status === 'fulfilled' && data && data.length
      ? data.map((val) => ({
          value: val.id,
          label: val.bankName,
        }))
      : [];
  const getLabelByValue = (
    data: {
      value: string;
      label: string;
    }[],
    targetValue: string,
  ): string | null => {
    for (const item of data) {
      if (item.value === targetValue) {
        return item.label;
      }
    }
    return null;
  };
  return (
    <>
      <CardList
        name={name}
        control={control}
        title="Bank Account Information List"
        initialValues={{
          accountHolderFullName: '',
          accountNumber: '',
          bankBranchAddress: '',
          currency: '',
          bankSWIFT_BICCode: '',
          iBAN: '',
          status: '',
          bankId: '',
          bankName: '',
          hashValue: '',
        }}
        itemSchema={itemSchema}
        modalBody={(getInputProps) => (
          <>
            <LoadingOverlay
              visible={isLoading}
              overlayProps={{ radius: 'sm', blur: 2 }}
            />
            <Flex className="p-4 flex-col">
              <Flex className="flex-wrap">
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <TextInput
                    className="w-full"
                    label="Account Holder Full Name"
                    id="accountHolderFullName"
                    {...getInputProps('accountHolderFullName')}
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <TextInput
                    className="w-full"
                    label="Account Number"
                    id="accountNumber"
                    type="number"
                    {...getInputProps('accountNumber')}
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <Select
                    className="w-full"
                    label="Bank Name"
                    id="bankName"
                    leftSection={<IconBuildingBank size="1rem" />}
                    data={bankList}
                    placeholder="select"
                    searchable
                    {...getInputProps('bankId', 'select')}
                    onChange={(value) => {
                      getInputProps('bankId', 'select').onChange(value);
                      getInputProps('bankName', 'select').onChange(
                        getLabelByValue(bankList, value as string),
                      );
                    }}
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <TextInput
                    className="w-full"
                    label="Branch Name"
                    id="branchName"
                    {...getInputProps('branchName')}
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <Textarea
                    className="w-full"
                    label="Bank Branch Address"
                    id="bankBranchAddress"
                    {...getInputProps('bankBranchAddress')}
                  />
                </Flex>
              </Flex>

              <Flex className="flex-wrap">
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <Select
                    className="w-full"
                    label="Currency"
                    id="currency"
                    leftSection={<IconCash size="1rem" />}
                    data={['Local', 'Foreign']}
                    placeholder="select"
                    searchable
                    {...getInputProps('currency', 'select')}
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <TextInput
                    className="w-full"
                    label="Bank SWIFT/BIC code"
                    id="bankSWIFT_BICCode"
                    {...getInputProps('bankSWIFT_BICCode')}
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <TextInput
                    className="w-full"
                    label="IBAN"
                    id="iBAN"
                    {...getInputProps('iBAN')}
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <Select
                    className="w-full"
                    label="Status"
                    id="status"
                    data={['Active', 'Inactive']}
                    placeholder="select"
                    searchable
                    {...getInputProps('status', 'select')}
                    disabled
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <TextInput
                    className="w-full"
                    label="Hash Value"
                    id="hashValue"
                    {...getInputProps('hashValue')}
                    disabled
                  />
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
        card={(edit, remove) => (
          <>
            {control?._formValues?.bankAccountDetails.map(
              (value: any, index: number) => (
                <Flex
                  key={index}
                  className="sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 items-center justify-center p-3"
                >
                  <Flex className="flex-col border w-56 h-40 shadow-md justify-between">
                    <Flex className="flex-col p-3 gap-1">
                      <div className=" text-lg font-[600]  truncate">
                        {getLabelByValue(bankList, value.bankId as string)}
                      </div>
                      <div className=" text-xs truncate ml-1">
                        Account Holders FullName: {value.accountHolderFullName}
                      </div>
                      <div className=" text-xs truncate ml-1">
                        AccountNumber: {value.accountNumber}
                      </div>
                      <div className=" text-xs  mb-[1rem] ml-1 truncate">
                        Bank Branch Address: {value.bankBranchAddress}
                      </div>
                    </Flex>

                    <Flex className=" justify-end border-t p-1">
                      <ActionMenu
                        renderOpenButton={() => <IconMenu size={'1rem'} />}
                        data={[
                          {
                            label: 'Edit',
                            action: () => edit(index),
                            icon: <IconPencil size={'1rem'} />,
                          },
                          {
                            label: 'Delete',
                            action: () => remove(index),
                            icon: <IconTrash size={'1rem'} color="red" />,
                          },
                        ]}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              ),
            )}
          </>
        )}
      />
    </>
  );
};
