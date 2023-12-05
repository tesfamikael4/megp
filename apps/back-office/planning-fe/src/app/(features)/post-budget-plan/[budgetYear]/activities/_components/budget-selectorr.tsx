'use client';

import { useListByAppIdQuery } from '@/app/(features)/budget/_api/budget.api';
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
import { useParams } from 'next/navigation';
import { useState } from 'react';

export const BudgetSelector = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const [selectedContract, setSelectedContract] = useState('');
  const [value, setValue] = useState('');
  const [detail, setDetail] = useState(undefined);
  const { budgetYear } = useParams();
  const { data } = useListByAppIdQuery(budgetYear as string);

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
        id: 'action',
        header: 'Allocated Budget',
        accessorKey: 'allocated budget',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {original['allocated budget'].toLocaleString('en-US', {
              style: 'currency',
              currency: original.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        ),
      },

      {
        id: 'action',
        header: 'Planned Value',
        accessorKey: 'planned value',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {original['planned value'].toLocaleString('en-US', {
              style: 'currency',
              currency: original.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        ),
      },
      {
        id: 'action',
        header: 'Balance',
        accessorKey: 'balance',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {original.balance.toLocaleString('en-US', {
              style: 'currency',
              currency: original.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
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
            <Table data={data?.items ?? []} config={config} />

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
