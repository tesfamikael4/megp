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

export const FrameworkSelector = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const [selectedContract, setSelectedContract] = useState('');
  const [value, setValue] = useState('');
  const [detail, setDetail] = useState(undefined);

  const config: TableConfig<any> = {
    columns: [
      {
        id: 'contractNo',
        header: '',
        accessorKey: 'contractNo',
        cell: ({ row: { original } }: any) => (
          <Radio
            onChange={() => setSelectedContract(original.contractNo)}
            checked={selectedContract === original.contractNo}
          />
        ),
      },
      {
        id: 'contractNo',
        header: 'Contract No',
        accessorKey: 'contractNo',
      },
      {
        id: 'title',
        header: 'Title',
        accessorKey: 'title',
      },
      {
        id: 'supplier',
        header: 'Supplier',
        accessorKey: 'supplier',
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
          label="Framework Contract"
          className="w-full"
          readOnly
          value={value}
        />
        <Button onClick={open}>Select</Button>
      </Flex>

      <Modal
        opened={opened}
        onClose={close}
        title="Framework Contract"
        size="lg"
      >
        {!detail && (
          <>
            <Table
              data={[
                {
                  contractNo: '11223344-08913',
                  title: 'Contract 1',
                  supplier: 'Supplier 1',
                  status: 'Active',
                  signedDate: 'Nov 23, 2022',
                  closingDate: 'Nov 23, 2024',
                },
                {
                  contractNo: '13200344-76013',
                  title: 'Contract 2',
                  supplier: 'Supplier 2',
                  status: 'Active',
                  signedDate: 'Apr 12, 2022',
                  closingDate: 'Apr 12, 2024',
                },
                {
                  contractNo: '11223344-00013',
                  title: 'Contract 3',
                  supplier: 'Supplier 3',
                  status: 'Active',
                  signedDate: 'Jun 21, 2023',
                  closingDate: 'Jun 21, 2025',
                },
                {
                  contractNo: '15200344-08713',
                  title: 'Contract 4',
                  supplier: 'Supplier 4',
                  status: 'Active',
                  signedDate: 'Aug 18, 2022',
                  closingDate: 'Aug 18, 2024',
                },
              ]}
              config={config}
            />

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
                    Contract No
                  </MantineTable.Td>
                  <MantineTable.Td>
                    {(detail as any)?.contractNo}
                  </MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Title
                  </MantineTable.Td>
                  <MantineTable.Td>{(detail as any)?.title}</MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Supplier
                  </MantineTable.Td>
                  <MantineTable.Td>{(detail as any)?.supplier}</MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Status
                  </MantineTable.Td>
                  <MantineTable.Td>{(detail as any)?.status}</MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Signed Date
                  </MantineTable.Td>
                  <MantineTable.Td>
                    {(detail as any)?.signedDate}
                  </MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Closing Date
                  </MantineTable.Td>
                  <MantineTable.Td>
                    {(detail as any)?.closingDate}
                  </MantineTable.Td>
                </MantineTable.Tr>
              </MantineTable.Tbody>
            </MantineTable>

            <Group justify="end" gap="md" className="mt-2">
              <Button onClick={() => setDetail(undefined)}>Back</Button>
              <Button
                onClick={() => {
                  setSelectedContract((detail as any)?.contractNo);
                  setValue((detail as any)?.contractNo);
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
