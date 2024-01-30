import {
  Accordion,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Text,
  TextInput,
} from '@mantine/core';
import { BudgetSelector } from './budget-selectorr';
import { useLazyReadQuery, useUpdateMutation } from '../_api/activities.api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Table, TableConfig, logger, notify } from '@megp/core-fe';
import {
  useCreatePostBudgetDisbursementMutation,
  useLazyGetPostBudgetDisbursementQuery,
  useGetPostBudgetPlansQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';

export const BudgetTab = () => {
  const [getActivity, { data, isLoading }] = useLazyReadQuery();
  const [createDisbursement, { isLoading: isDisbursementCreating }] =
    useCreatePostBudgetDisbursementMutation();
  const { id, budgetYear } = useParams();
  const { data: budgetYearWithApp, isLoading: isGetWithAppLoading } =
    useGetPostBudgetPlansQuery({
      where: [[{ column: 'id', value: budgetYear, operator: '=' }]],
    } as any);
  const [
    getDisbursement,
    {
      data: disbursement,
      isSuccess: isDisbursementSuccess,
      isLoading: isDisbursementLoading,
    },
  ] = useLazyGetPostBudgetDisbursementQuery();
  const config = {
    columns: [
      {
        title: 'Budget Year',
        accessor: 'budgetYear',
      },
      {
        title: '1st Quarter',
        accessor: 'quarter1',
      },
      {
        title: '2nd Quarter',
        accessor: 'quarter2',
      },
      {
        title: '3rd Quarter',
        accessor: 'quarter3',
      },
      {
        title: '4th Quarter',
        accessor: 'quarter4',
      },
      {
        title: 'Amount',
        accessor: 'amount',
        cell: ({ row: { original } }) => <Amount original={original} />,
      },
    ],
  };

  const [budgetYearDisbursement, setBudgetYearDisbursement] = useState<
    Record<string, any>[]
  >([
    {
      budgetYear: budgetYearWithApp?.items?.[0].app.budgetYear,
      amount: 0,
      quarter1: '212',
      quarter2: '321',
      quarter3: '1123',
      quarter4: '3212',
    },
  ]);

  const handleAdd = () => {
    const lastYear = budgetYearDisbursement[budgetYearDisbursement.length - 1];
    const temp: any[] = [];
    ['1st', '2nd', '3rd', '4th'].map((quarter, index) => {
      logger.log({ quarter });
      temp.push({
        budgetYear: parseInt(lastYear.budgetYear) + 1,
        amount: 0,
        quarter: `${quarter} Quarter`,
        order: index,
      });
    });
    setBudgetYearDisbursement([...budgetYearDisbursement, ...temp]);
  };

  const Amount = ({ original }: any) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    const [amount, setAmount] = useState(original.amount);
    const onBlur = () => {
      setIsEditorOpened(false);
      const temp = budgetYearDisbursement.map((b) => {
        if (
          b.quarter === original.quarter &&
          b.budgetYearId === original.budgetYearId
        ) {
          return { ...b, amount: parseInt(amount) };
        }
        return b;
      });

      setBudgetYearDisbursement([...temp]);
    };
    return (
      <>
        {!isEditorOpened && (
          <Text onClick={() => setIsEditorOpened(true)} className="text-end">
            {original.amount.toLocaleString('en-US', {
              style: 'currency',
              currency: data?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        )}
        {isEditorOpened && (
          <>
            <TextInput
              value={amount}
              type="number"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              onBlur={onBlur}
              rightSection={data?.currency ?? 'MKW'}
            />
          </>
        )}
      </>
    );
  };

  useEffect(() => {
    getActivity(id as string);
  }, [getActivity, id]);

  useEffect(() => {
    if (isDisbursementSuccess) {
      disbursement.total != 0 && setBudgetYearDisbursement(disbursement.items);
    }
  }, [disbursement, isDisbursementSuccess]);

  useEffect(() => {
    if (budgetYearWithApp) {
      const temp = budgetYearDisbursement.map((b) => ({
        ...b,

        budgetYear: budgetYearWithApp?.items?.[0].app.budgetYear,
      }));

      setBudgetYearDisbursement(temp);
    }
  }, [budgetYearWithApp]);

  useEffect(() => {
    getDisbursement(id as string);
  }, [getDisbursement, id]);

  const onSave = async () => {
    logger.log({ budgetYearDisbursement });
    const castedData = budgetYearDisbursement.map((b) => ({
      ...b,
      postBudgetPlanActivityId: id,
      currency: data?.currency,
    }));
    logger.log({ castedData });
    try {
      await createDisbursement(castedData);
      notify('Success', 'Saved Successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <Box className="mt-2" pos="relative">
      <LoadingOverlay
        visible={isLoading || isDisbursementLoading || isGetWithAppLoading}
      />
      <BudgetSelector />

      <Box className="mt-5">
        <Divider label="Disbursement" />
        {data?.isMultiYear && (
          <Flex justify="end" align="center" className="mt-2 text-slate-500 ">
            <IconPlus size="16" />
            <Text fw="500" onClick={handleAdd} className="cursor-pointer">
              Add
            </Text>
          </Flex>
        )}
      </Box>
      <ExpandableTable data={budgetYearDisbursement ?? []} config={config} />

      <Group justify="end" className="mt-2">
        <Divider h={2} />
        <Button loading={isDisbursementCreating} onClick={onSave}>
          Save
        </Button>
      </Group>
    </Box>
  );
};
