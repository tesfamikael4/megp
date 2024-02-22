import {
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import React from 'react';
import { Select } from '@mantine/core';
import { PassFormDataProps } from './formShell';
import {
  CardListShell,
  SingleCardWrapper,
} from '../../../../../_components/cardList/cardListShell';
import { useGetBankListQuery } from '../../../_api/query';
import { usePrivilege } from '../../_context/privilege-context';
import { CardItem } from './contactPersons';
import {
  Icon123,
  IconBuildingBank,
  IconMapPin,
  IconUser,
} from '@tabler/icons-react';

interface Props extends Partial<PassFormDataProps> {
  itemSchema: any;
  name: string;
}

export const BankAccountDetails: React.FC<Props> = ({
  control,
  itemSchema,
  name,
}) => {
  const { checkAccess } = usePrivilege();

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
          accountHolderFullName: '',
          accountNumber: '',
          branchAddress: '',
          currency: '',
          bankSwift: '',
          IBAN: '',
          status: '',
          bankId: '',
          bankName: '',
          hashValue: '',
          accountType: '',
          isDefualt: true,
        }}
        itemSchema={itemSchema}
        disabled={!checkAccess('detail')}
        modalBody={(getInputProps) => (
          <>
            <LoadingOverlay
              visible={isLoading}
              overlayProps={{ radius: 'sm', blur: 2 }}
            />
            <Stack>
              <Group grow>
                <TextInput
                  withAsterisk
                  label="Account Holder Full Name"
                  {...getInputProps('accountHolderFullName')}
                />

                <TextInput
                  label="Account Number"
                  withAsterisk
                  type="number"
                  {...getInputProps('accountNumber')}
                />
              </Group>
              <Group grow>
                <Select
                  label="Bank Name"
                  withAsterisk
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
                  {...getInputProps('branchAddress')}
                />
                <Select
                  label="Currency"
                  data={['USD', 'ETB', 'EUR', 'GBP', 'MKW']}
                  withAsterisk
                  placeholder="select"
                  searchable
                  {...getInputProps('currency', 'select')}
                />
              </Group>
              <Group grow>
                <TextInput
                  label="Bank SWIFT/BIC code"
                  withAsterisk
                  {...getInputProps('bankSwift')}
                />

                <TextInput
                  withAsterisk
                  label="IBAN"
                  {...getInputProps('IBAN')}
                />
              </Group>
              <Group grow></Group>
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
                  disabled={!checkAccess('detail')}
                >
                  <Stack gap={0}>
                    <CardItem
                      label={getLabelByValue(bankList, value.bankId as string)}
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
