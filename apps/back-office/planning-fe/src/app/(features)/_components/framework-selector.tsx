'use client';

import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  Radio,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Table, TableConfig } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import { DetailTable } from './detail-table';

export const FrameworkSelector = ({ contract, onSelect }: any) => {
  const [opened, { close, open }] = useDisclosure(false);
  const [selectedContract, setSelectedContract] = useState(contract);
  const [detail, setDetail] = useState(undefined);

  const config: TableConfig<any> = {
    columns: [
      {
        id: 'contractNo',
        header: '',
        accessorKey: 'contractNo',
        cell: ({ row: { original } }: any) => (
          <Radio
            onChange={() => setSelectedContract(original)}
            checked={selectedContract?.contractNo === original.contractNo}
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
          label="Signed Contracts"
          className="w-full"
          readOnly
          value={contract.title ?? ''}
        />
        <Button onClick={open}>Select</Button>
      </Flex>

      <Modal opened={opened} onClose={close} title="Purchased Orders" size="lg">
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
                  onSelect(selectedContract);
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
            <DetailTable
              data={[
                {
                  key: 'Contract No',
                  value: (detail as any)?.contractNo,
                },
                {
                  key: 'Title',
                  value: (detail as any)?.title,
                },
                {
                  key: 'Supplier',
                  value: (detail as any)?.supplier,
                },
                {
                  key: 'Signed Date',
                  value: (detail as any)?.signedDate,
                },
                {
                  key: 'Closing Date',
                  value: (detail as any)?.closingDate,
                },
              ]}
            />

            <Group justify="end" gap="md" className="mt-2">
              <Button onClick={() => setDetail(undefined)}>Back</Button>
              <Button
                onClick={() => {
                  setSelectedContract(detail);
                  onSelect(detail);
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
