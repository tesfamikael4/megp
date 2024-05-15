import {
  Checkbox,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import React from 'react';
import { Select } from '@mantine/core';
import { PassFormDataProps } from './formShell';
import { CardItem } from './contactPersons';
import {
  Icon123,
  IconBuildingBank,
  IconMapPin,
  IconUser,
} from '@tabler/icons-react';
import { useGetBankListQuery } from '../../_api/query';
import {
  CardListShell,
  SingleCardWrapper,
} from '@/app/(features)/my-workspace/_components/cardList/cardListShell';

interface Props extends PassFormDataProps {
  itemSchema: any;
  name: string;
  disabled: boolean;
}

export const BankAccountDetails: React.FC<Props> = ({
  control,
  itemSchema,
  name,
  register,
  disabled,
}) => {
  // console.log(control._getWatch(`bankAccountDetails`));
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
        title="Bank Account Information"
        initialValues={{
          bankId: '',
          bankType: 'International', // Assuming default to "International"
          bankName: '',
          branchName: '',
          accountType: 'Saving', // Assuming default to "Saving"
          accountNumber: '',
          branchAddress: undefined,
          accountHolderFullName: '',
          currency: '',
          IBAN: '',
          status: '',
          hashValue: '',
          isDefualt: false,
          swiftCode: '',
        }}
        itemSchema={itemSchema}
        disabled={disabled}
        modalBody={(getInputProps) => (
          <>
            <LoadingOverlay
              visible={isLoading}
              overlayProps={{ radius: 'sm', blur: 2 }}
            />
            <Stack>
              <Group grow>
                <Select
                  label="Bank Type"
                  withAsterisk
                  data={['International', 'Local']}
                  placeholder="select"
                  searchable
                  {...getInputProps('bankType', 'select')}
                />
                <Select
                  label="Account Type"
                  withAsterisk
                  data={['Saving', 'Current']}
                  placeholder="Select Account Type"
                  searchable
                  {...getInputProps('accountType', 'select')}
                  onChange={(value) => {
                    getInputProps('accountType', 'select').onChange(value);
                  }}
                />
              </Group>
              <Group grow>
                <TextInput
                  withAsterisk
                  label="Account Holder Full Name"
                  placeholder="Enter account holder full name"
                  {...getInputProps('accountHolderFullName')}
                />

                <TextInput
                  label="Account Number"
                  placeholder="Enter Account Number"
                  withAsterisk
                  type="number"
                  {...getInputProps('accountNumber')}
                />
              </Group>

              <Group grow>
                {getInputProps('bankType', 'select').value === 'Local' ? (
                  <>
                    <Select
                      label="Bank Name"
                      withAsterisk
                      data={bankList}
                      placeholder="Select Bank Name"
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
                      placeholder="Enter Branch name"
                      withAsterisk
                      required
                      {...getInputProps('branchName')}
                    />
                  </>
                ) : (
                  <>
                    {' '}
                    <TextInput
                      label="Bank Name"
                      placeholder="Enter Bank name"
                      {...getInputProps('bankName')}
                    />
                    <TextInput
                      label="Branch Name"
                      placeholder="Enter Branch name"
                      {...getInputProps('branchName')}
                    />
                  </>
                )}
              </Group>
              <Group grow>
                <Textarea
                  label="Bank Branch Address"
                  placeholder="Enter branch address"
                  {...getInputProps('branchAddress')}
                />
                <Select
                  label="Currency"
                  data={['USD', 'ETB', 'EUR', 'GBP', 'MKW']}
                  withAsterisk
                  placeholder="Select Currency"
                  searchable
                  {...getInputProps('currency', 'select')}
                />
              </Group>
              {getInputProps('bankType', 'select').value ===
                'International' && (
                <Group grow>
                  <TextInput
                    label="Bank SWIFT/BIC code"
                    placeholder="Enter SWIFT/BIC code"
                    withAsterisk
                    {...getInputProps('swiftCode')}
                  />

                  <TextInput
                    withAsterisk
                    label="International Bank Account Number (IBAN)"
                    placeholder="Enter International Bank Account Number (IBAN)"
                    {...getInputProps('IBAN')}
                  />
                </Group>
              )}
              <Group grow>
                {(control?._formValues?.bankAccountDetails.every(
                  (val: any) => !val.isDefualt,
                ) ||
                  getInputProps('isDefualt', 'checkbox').value) && (
                  <Checkbox
                    label="Is Default"
                    checked={getInputProps('isDefualt', 'checkbox').value}
                    {...getInputProps('isDefualt', 'checkbox')}
                    onChange={(event) => {
                      getInputProps('isDefualt', 'checkbox').onChange(
                        event.currentTarget.checked,
                      );
                    }}
                  />
                )}
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
                  disabled={disabled}
                >
                  <Stack gap={0}>
                    <CardItem
                      label={value.bankName}
                      icon={
                        <IconBuildingBank
                          size={25}
                          stroke={1.5}
                          color={'green'}
                        />
                      }
                      bold
                    />
                    <CardItem
                      label={value.accountHolderFullName}
                      icon={<IconUser size={25} stroke={1.5} color={'green'} />}
                    />
                    <CardItem
                      label={value.accountNumber}
                      icon={<Icon123 size={25} stroke={1.5} color={'green'} />}
                    />
                    <CardItem
                      label={value.branchAddress}
                      icon={
                        <IconMapPin size={25} stroke={1.5} color={'green'} />
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
