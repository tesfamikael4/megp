'use client';

import { DetailTable } from '@/app/(features)/_components/detail-table';

import { useLazyListByIdQuery } from '@/app/(features)/budget/_api/budget.api';
import {
  useAddBudgetMutation,
  useGetPostBudgetPlanQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';
import {
  Button,
  Flex,
  Group,
  Modal,
  TextInput,
  Box,
  LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ExpandableTable,
  ExpandableTableConfig,
  logger,
  notify,
} from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const BudgetSelector = ({ activity, disableFields }: any) => {
  const [opened, { close, open }] = useDisclosure(false);
  const [selectedContract, setSelectedContract] = useState<any[]>([]);
  const [value, setValue] = useState('');
  const { budgetYear, id } = useParams();
  // const { data } = useListByAppIdQuery(budgetYear as string);
  const [getBudget, { data, isLoading }] = useLazyListByIdQuery();
  const [
    getSelectedData,
    { data: selectedData, isSuccess: isSelectedDataSuccess },
  ] = useLazyListByIdQuery();
  const [addBudget, { isLoading: isSaving }] = useAddBudgetMutation();
  const { data: postBudget, isLoading: isPostBudgetLoading } =
    useGetPostBudgetPlanQuery(budgetYear as string);

  const config: ExpandableTableConfig = {
    isSearchable: true,
    primaryColumn: 'budgetCode',
    disableMultiSelect: true,
    selectedItems: selectedContract,
    setSelectedItems: (data) => {
      const temp = data.filter((d) => !selectedContract.includes(d));
      setSelectedContract(temp);
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

  const onSubmit = async () => {
    if (selectedContract.length !== 0) {
      try {
        await addBudget({
          postBudgetPlanActivityId: id,
          budgetId: selectedContract[0].id,
        }).unwrap();
        notify('Success', 'Saved Successfully');
      } catch (err) {
        logger.log({ err });
        if (err.status === 430) {
          notify('Error', err.data.message);
        } else {
          notify('Error', 'Something went wrong');
        }
      }
      close();
    }
  };

  useEffect(() => {
    if (activity) {
      getSelectedData({
        id: postBudget?.appId,
        collectionQuery: {
          where: [[{ column: 'id', operator: '=', value: activity.budgetId }]],
        },
      });
    }
  }, [activity, getSelectedData, postBudget]);

  useEffect(() => {
    if (isSelectedDataSuccess && selectedData) {
      setValue(selectedData.items[0].budgetCode);
    }
  }, [isSelectedDataSuccess, selectedData]);
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading || isPostBudgetLoading} />
      <Flex gap="md" align="end">
        <TextInput
          label="Select Budget Line"
          className="w-full"
          readOnly
          value={value}
          onClick={open}
          disabled={disableFields}
        />
      </Flex>

      <Modal
        opened={opened}
        onClose={close}
        title="Budget Line"
        size="70%"
        // centered
      >
        <>
          <ExpandableTable
            data={data?.items ?? []}
            config={config}
            total={data?.total ?? 0}
            onRequestChange={(collectionQuery) => {
              getBudget({ id: postBudget?.appId, collectionQuery });
            }}
          />

          <Group justify="end">
            <Button
              onClick={() => {
                setValue(selectedContract[0].budgetCode);
                close();
              }}
            >
              Done
            </Button>
          </Group>
        </>
      </Modal>

      <Group justify="end" className="mt-2">
        <Button onClick={onSubmit} disabled={disableFields} loading={isSaving}>
          Save
        </Button>
      </Group>
    </Box>
  );
};
