'use client';

import { DetailTable } from '@/app/(features)/_components/detail-table';
import { useLazyListByAppIdQuery } from '@/app/(features)/budget/_api/budget.api';
import { useGetPostBudgetPlanQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  Radio,
  TextInput,
  Table as MantineTable,
  Box,
  LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Table, TableConfig } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const BudgetSelector = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const [selectedContract, setSelectedContract] = useState('');
  const [value, setValue] = useState('');
  const [detail, setDetail] = useState(undefined);
  const { budgetYear } = useParams();
  // const { data } = useListByAppIdQuery(budgetYear as string);
  const [getBudget, { data, isLoading }] = useLazyListByAppIdQuery();
  const {
    data: postBudget,
    isLoading: isPostBudgetLoading,
    isSuccess,
  } = useGetPostBudgetPlanQuery(budgetYear as string);
  const detailInfo = [
    {
      key: 'Budget Line',
      value: (detail as any)?.coa,
    },
    {
      key: 'Description',
      value: (detail as any)?.description,
    },
    {
      key: 'Funding Source',
      value: (detail as any)?.fundingSource,
    },
    {
      key: 'Allocated Budget',
      value: (detail as any)?.allocatedBudget,
    },
    {
      key: 'Planned Value',
      value: (detail as any)?.plannedValue,
    },
    {
      key: 'Balance',
      value: (detail as any)?.balance,
    },
    {
      key: 'Currency',
      value: (detail as any)?.currency,
    },
    {
      key: 'Type',
      value: (detail as any)?.type,
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
            onChange={() => setSelectedContract(original.coa)}
            checked={selectedContract === original.coa}
          />
        ),
      },
      {
        id: 'coa',
        header: 'Budget Line',
        accessorKey: 'coa',
      },
      {
        id: 'action',
        header: 'Allocated Budget',
        accessorKey: 'allocatedBudget',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {original['allocatedBudget'].toLocaleString('en-US', {
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
            {original['plannedValue'].toLocaleString('en-US', {
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

  useEffect(() => {
    isSuccess && getBudget(postBudget?.appId);
  }, [getBudget, isSuccess, postBudget]);
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading || isPostBudgetLoading} />
      <Flex gap="md" align="end">
        <TextInput
          label="Select Budget Line"
          className="w-full"
          readOnly
          value={value}
        />
        <Button onClick={open}>Select</Button>
      </Flex>

      <Modal
        opened={opened}
        onClose={close}
        title="Budget Line"
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
            <DetailTable data={detailInfo} />

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
    </Box>
  );
};
