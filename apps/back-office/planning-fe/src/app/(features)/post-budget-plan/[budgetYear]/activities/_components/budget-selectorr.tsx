'use client';

import { CollectionSelector } from '@/app/(features)/_components/collection-selector';
import { DetailTable } from '@/app/(features)/_components/detail-table';
import { useLazyListByIdQuery } from '@/app/(features)/budget/_api/budget.api';
import { useGetPostBudgetPlanQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  Radio,
  TextInput,
  Box,
  LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TableConfig, logger } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const BudgetSelector = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const [, setSelectedContract] = useState('');
  const [value, setValue] = useState('');
  const [detail, setDetail] = useState(undefined);
  const { budgetYear } = useParams();
  // const { data } = useListByAppIdQuery(budgetYear as string);
  const [getBudget, { data, isLoading }] = useLazyListByIdQuery();
  const {
    data: postBudget,
    isLoading: isPostBudgetLoading,
    isSuccess,
  } = useGetPostBudgetPlanQuery(budgetYear as string);
  const detailInfo = [
    {
      key: 'Budget Code',
      value: (detail as any)?.budgetCode,
    },
    {
      key: 'Description',
      value: (detail as any)?.description,
    },
    {
      key: 'Allocated Budget',
      value: parseInt((detail as any)?.allocatedBudget).toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: (detail as any)?.currency ?? 'MKW',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      ),
    },
    {
      key: 'Revised Budget',
      value: parseInt((detail as any)?.revisedBudget).toLocaleString('en-US', {
        style: 'currency',
        currency: (detail as any)?.currency ?? 'MKW',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      key: 'Available Budget',
      value: parseInt((detail as any)?.availableBudget).toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: (detail as any)?.currency ?? 'MKW',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      ),
    },
    {
      key: 'Funding Source',
      value: (detail as any)?.fundingSource,
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
        id: 'budgetCode',
        header: 'Budget Line',
        accessorKey: 'budgetCode',
      },
      {
        id: 'action',
        header: 'Allocated Budget',
        accessorKey: 'allocatedBudget',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {parseInt(original.allocatedBudget).toLocaleString('en-US', {
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
        header: 'Revised Budget',
        accessorKey: 'revisedBudget',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {parseInt(original.revisedBudget).toLocaleString('en-US', {
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
        header: 'Available Budget',
        accessorKey: 'availableBudget',
        cell: ({ row: { original } }) => (
          <p className="text-right">
            {parseInt(original.availableBudget).toLocaleString('en-US', {
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
    isSuccess &&
      getBudget({
        id: postBudget?.appId,
        collectionQuery: {
          skip: 0,
          take: 10,
        },
      });
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
            <CollectionSelector
              data={data?.items ?? []}
              config={config}
              total={data?.total ?? 0}
              onDone={(data) => {
                setSelectedContract(data.budgetCode);
                setValue(data.budgetCode);
                close();
                setDetail(undefined);
              }}
              onRequestChange={(collectionQuery) => {
                getBudget({ id: postBudget?.appId, collectionQuery });
              }}
            />
          </>
        )}

        {detail && (
          <>
            <DetailTable data={detailInfo} />

            <Group justify="end" gap="md" className="mt-2">
              <Button onClick={() => setDetail(undefined)}>Back</Button>
              <Button
                onClick={() => {
                  setSelectedContract((detail as any)?.budgetCode);
                  setValue((detail as any)?.budgetCode);
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
