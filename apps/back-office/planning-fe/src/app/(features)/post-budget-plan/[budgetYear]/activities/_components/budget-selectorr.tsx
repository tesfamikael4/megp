'use client';

import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  Radio,
  TextInput,
  Table as MantineTable,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Table, TableConfig } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';

export const BudgetSelector = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const [selectedContract, setSelectedContract] = useState('');
  const [value, setValue] = useState('');
  const [detail, setDetail] = useState(undefined);

  const data = [
    {
      No: 1,
      COA: '27100318-10-20183-10970-101-00000-211100101',
      'allocated budget': 10003658741,
      'planned value': 9998658741,
      balance: 5000000,
      type: 'new',
      contentvalue: null,
      currency: 'USD',
    },
    {
      No: 2,
      COA: '27100318-10-20183-10970-101-00000-211100102',
      'allocated budget': 5000330890,
      'planned value': 499983000,
      balance: 4500347890,
      type: 'new',
      contentvalue: null,
      currency: 'USD',
    },
    {
      No: 3,
      COA: '27100318-10-20183-10970-101-00000-211100103',
      'allocated budget': 1200004400,
      'planned value': 199954400,
      balance: 1000050000,
      type: 'new',
      contentvalue: null,
      currency: 'USD',
    },
    {
      No: 4,
      COA: '27100318-10-20183-10970-101-00000-211100104',
      'allocated budget': 1200003309,
      'planned value': 1199953300,
      balance: 50009,
      type: 'new',
      contentvalue: null,
      currency: 'USD',
    },
    {
      No: 5,
      COA: '27100318-10-20183-10970-101-00100-211100105',
      'allocated budget': 50003555455,
      'planned value': 499950000,
      balance: 49503605455,
      type: 'new',
      contentvalue: null,
      currency: 'USD',
    },
    {
      No: 6,
      COA: '27100318-10-20183-10970-101-00000-211100106',
      'allocated budget': 10096547200,
      'planned value': 10096497200,
      balance: 50000,
      type: 'new',
      contentvalue: null,
      currency: 'USD',
    },
    {
      No: 7,
      COA: '27100318-10-20183-10970-101-00000-211100107',
      'allocated budget': 100000000,
      'planned value': 99950000,
      balance: 50000,
      type: 'new',
      contentvalue: null,
      currency: 'USD',
    },
    {
      No: 8,
      COA: '27100318-10-20183-10970-101-00000-211100108',
      'allocated budget': 5458794,
      'planned value': 5455294,
      balance: 3500,
      type: 'new',
      contentvalue: null,
      currency: 'USD',
    },
    {
      No: 9,
      COA: '27100318-10-20183-10970-101-00100-211100109',
      'allocated budget': 100000000,
      'planned value': 99950000,
      balance: 50000,
      type: 'new',
      contentvalue: null,
      currency: 'USD',
    },
    {
      No: 10,
      COA: '27100318-10-20183-10970-101-00000-211100110',
      'allocated budget': 1000450000,
      'planned value': 1000400000,
      balance: 50000,
      type: 'new',
      contentvalue: null,
      currency: 'USD',
    },
  ];

  const config: TableConfig<any> = {
    columns: [
      {
        id: 'contractNo',
        header: '',
        accessorKey: 'contractNo',
        cell: ({ row: { original } }: any) => (
          <Radio
            onChange={() => setSelectedContract(original.COA)}
            checked={selectedContract === original.COA}
          />
        ),
      },
      {
        id: 'COA',
        header: 'COA',
        accessorKey: 'COA',
      },
      {
        header: 'Allocated Budget',
        accessorKey: 'allocated budget',
        cell: ({ row: { original } }) => (
          <>
            {original['allocated budget'].toLocaleString('en-US', {
              style: 'currency',
              currency: original.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        ),
      },
      {
        header: 'Balance',
        accessorKey: 'balance',
        cell: ({ row: { original } }) => (
          <>
            {original.balance.toLocaleString('en-US', {
              style: 'currency',
              currency: original.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        ),
      },
      {
        header: 'Planned Value',
        accessorKey: 'planned value',
        cell: ({ row: { original } }) => (
          <>
            {original['planned value'].toLocaleString('en-US', {
              style: 'currency',
              currency: original.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        ),
      },
      {
        id: 'action',
        header: '',
        accessorKey: 'action',
        cell: ({ row: { original } }: any) => (
          <ActionIcon variant="transparent" onClick={() => setDetail(original)}>
            <IconChevronRight className="text-black" />
          </ActionIcon>
        ),
      },
    ],
  };
  return (
    <>
      <Flex gap="md" align="end">
        <TextInput
          label="Select Chart of account"
          className="w-full"
          readOnly
          value={value}
        />
        <Button onClick={open}>Select</Button>
      </Flex>

      <Modal
        opened={opened}
        onClose={close}
        title="Chart of Account"
        size="55rem"
        // centered
      >
        {!detail && (
          <>
            <Table data={data} config={config} />

            <Group justify="end" className="mt-2">
              <Button
                onClick={() => {
                  setValue(selectedContract);
                  close();
                }}
              >
                Select
              </Button>
            </Group>
          </>
        )}

        {detail && (
          <>
            <MantineTable highlightOnHover withTableBorder withColumnBorders>
              <MantineTable.Tbody>
                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    COA
                  </MantineTable.Td>
                  <MantineTable.Td>{(detail as any)?.COA}</MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Allocated budget
                  </MantineTable.Td>
                  <MantineTable.Td>
                    {(detail as any)?.['allocated budget'].toLocaleString(
                      'en-US',
                      {
                        style: 'currency',
                        currency: (detail as any).currency,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                  </MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Planned value
                  </MantineTable.Td>
                  <MantineTable.Td>
                    {(detail as any)?.['planned value'].toLocaleString(
                      'en-US',
                      {
                        style: 'currency',
                        currency: (detail as any).currency,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                  </MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Balance
                  </MantineTable.Td>
                  <MantineTable.Td>
                    {(detail as any)?.balance.toLocaleString('en-US', {
                      style: 'currency',
                      currency: (detail as any).currency,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Type
                  </MantineTable.Td>
                  <MantineTable.Td>{(detail as any)?.type}</MantineTable.Td>
                </MantineTable.Tr>
              </MantineTable.Tbody>
            </MantineTable>

            <Group justify="end" gap="md" className="mt-2">
              <Button onClick={() => setDetail(undefined)}>Back</Button>
              <Button
                onClick={() => {
                  setSelectedContract((detail as any)?.COA);
                  setValue((detail as any)?.COA);
                  close();
                  setDetail(undefined);
                }}
              >
                Select
              </Button>
            </Group>
          </>
        )}
      </Modal>
    </>
  );
};
