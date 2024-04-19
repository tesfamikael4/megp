'use client';

import { DetailTable } from '@/app/(features)/_components/detail-table';
import { useLazyGetBudgetQuery } from '@/store/api/pr/pr.api';
import {
  Button,
  Group,
  Modal,
  TextInput,
  Box,
  LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, ExpandableTableConfig } from '@megp/core-fe';
import { useEffect, useState } from 'react';

export const BudgetSelector = ({
  disableFields,
  budget,
  setBudget,
  error,
}: any) => {
  const [opened, { close, open }] = useDisclosure(false);
  const [selectedBudget, setSelectedBudget] = useState<any[]>([]);

  const [getBudget, { data, isLoading }] = useLazyGetBudgetQuery();

  const config: ExpandableTableConfig = {
    disableMultiSelect: true,
    selectedItems: selectedBudget,
    setSelectedItems: (data) => {
      const temp = data.filter((d) => !selectedBudget.includes(d));
      setSelectedBudget(temp);
    },
    isExpandable: true,
    expandedRowContent: (budget) => {
      const castedBudget = [
        {
          key: 'Budget Code',
          value: budget?.budgetCode,
        },
        {
          key: 'Description',
          value: budget?.description,
        },
        {
          key: 'Allocated Budget',
          value: parseInt(budget?.allocatedBudget).toLocaleString('en-US', {
            style: 'currency',
            currency: budget?.currency ?? 'MKW',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currencyDisplay: 'code',
          }),
        },
        {
          key: 'Revised Budget',
          value: parseInt(budget?.revisedBudget).toLocaleString('en-US', {
            style: 'currency',
            currency: budget?.currency ?? 'MKW',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currencyDisplay: 'code',
          }),
        },
        {
          key: 'Available Budget',
          value: parseInt(budget?.availableBudget).toLocaleString('en-US', {
            style: 'currency',
            currency: budget?.currency ?? 'MKW',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currencyDisplay: 'code',
          }),
        },
        {
          key: 'Funding Source',
          value: budget?.fundingSource,
        },

        {
          key: 'Type',
          value: budget?.type,
        },
      ];
      return (
        <Box className="bg-white p-3">
          <DetailTable data={castedBudget} />
        </Box>
      );
    },
    columns: [
      {
        title: 'Budget Line',
        accessor: 'budgetCode',
      },
      {
        title: 'Allocated Budget',
        accessor: 'allocatedBudget',
        textAlign: 'right',
        render: (record) => (
          <p className="text-right">
            {parseInt(record.allocatedBudget).toLocaleString('en-US', {
              style: 'currency',
              currency: record.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        title: 'Revised Budget',
        accessor: 'revisedBudget',
        textAlign: 'right',
        render: (record) => (
          <p className="text-right">
            {parseInt(record.revisedBudget).toLocaleString('en-US', {
              style: 'currency',
              currency: record.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        title: 'Available Budget',
        accessor: 'availableBudget',
        textAlign: 'right',
        render: (record) => (
          <p className="text-right">
            {parseInt(record.availableBudget).toLocaleString('en-US', {
              style: 'currency',
              currency: record.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
    ],
  };

  useEffect(() => {
    getBudget(undefined);
  }, [getBudget]);

  useEffect(() => {
    setSelectedBudget([budget]);
  }, [budget]);

  return (
    <Box>
      <TextInput
        label="Select Budget Line"
        className="w-full"
        readOnly
        value={budget?.budgetCode}
        onClick={open}
        disabled={disableFields}
        error={error}
        withAsterisk
      />

      <Modal
        opened={opened}
        onClose={close}
        title={<Box fw={'bold'}>Budget Line</Box>}
        size="70%"
        pos={'relative'}
      >
        <LoadingOverlay visible={isLoading} />

        <>
          <ExpandableTable
            data={data?.items ?? []}
            config={config}
            total={data?.total ?? 0}
            onRequestChange={(collectionQuery) => {
              getBudget(collectionQuery);
            }}
          />

          <Group justify="end">
            <Button
              onClick={() => {
                setBudget(selectedBudget[0]);
                close();
              }}
            >
              Done
            </Button>
          </Group>
        </>
      </Modal>
    </Box>
  );
};
