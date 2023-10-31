import {
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import React from 'react';
import { Select } from '@mantine/core';
import { PassFormDataProps } from './formShell';
import {
  CardListShell,
  SingleCardWrapper,
} from '../../../../_components/cardList/cardListShell';
import { useGetBankListQuery } from '../../_api/query';

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
      <CardListShell
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
            <Stack>
              <Group grow>
                <TextInput
                  label="Account Holder Full Name"
                  {...getInputProps('accountHolderFullName')}
                />

                <TextInput
                  label="Account Number"
                  type="number"
                  {...getInputProps('accountNumber')}
                />
              </Group>
              <Group grow>
                <Select
                  label="Bank Name"
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

                <TextInput
                  label="Branch Name"
                  {...getInputProps('branchName')}
                />
              </Group>
              <Group grow>
                <Textarea
                  label="Bank Branch Address"
                  {...getInputProps('bankBranchAddress')}
                />
                <Select
                  label="Currency"
                  data={['Local', 'Foreign']}
                  placeholder="select"
                  searchable
                  {...getInputProps('currency', 'select')}
                />
              </Group>
              <Group grow>
                <TextInput
                  label="Bank SWIFT/BIC code"
                  {...getInputProps('bankSWIFT_BICCode')}
                />

                <TextInput label="IBAN" {...getInputProps('iBAN')} />
              </Group>
              <Group grow>
                <Select
                  label="Status"
                  data={['Active', 'Inactive']}
                  placeholder="select"
                  searchable
                  {...getInputProps('status', 'select')}
                  disabled
                />

                <TextInput
                  label="Hash Value"
                  {...getInputProps('hashValue')}
                  disabled
                />
              </Group>
            </Stack>
          </>
        )}
        card={(edit, remove) => (
          <>
            {control?._formValues?.bankAccountDetails.map(
              (value: any, index: number) => (
                <SingleCardWrapper
                  key={index}
                  edit={() => edit(index)}
                  remove={() => remove(index)}
                >
                  <Stack gap={0}>
                    <Text fw={600} truncate>
                      {getLabelByValue(bankList, value.bankId as string)}
                    </Text>
                    <Text fz="xs" truncate>
                      Account Holders FullName: {value.accountHolderFullName}
                    </Text>
                    <Text fz="xs" truncate>
                      AccountNumber: {value.accountNumber}
                    </Text>
                    <Text fz="xs" truncate>
                      Bank Branch Address: {value.bankBranchAddress}
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
