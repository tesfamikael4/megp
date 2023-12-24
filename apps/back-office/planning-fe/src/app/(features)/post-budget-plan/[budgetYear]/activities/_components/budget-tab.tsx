import {
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
  useGetPostBudgetDisbursementQuery,
  useGetPostBudgetPlansQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';

export const BudgetTab = () => {
  const [getActivity, { data, isLoading }] = useLazyReadQuery();
  const [createDisbursement, { isLoading: isDisbursementCreating }] =
    useCreatePostBudgetDisbursementMutation();
  const { id, budgetYear } = useParams();
  const { data: budgetYearWithApp, isLoading: isGetWithAppLoading } =
    useGetPostBudgetPlansQuery({
      where: [[{ column: 'id', value: budgetYear, operator: '=' }]],
    } as any);
  const {
    data: disbursement,
    isSuccess: isDisbursementSuccess,
    isLoading: isDisbursementLoading,
  } = useGetPostBudgetDisbursementQuery(id as string);
  const config: TableConfig<any> = {
    columns: [
      {
        header: 'Budget Year',
        accessorKey: 'budgetYearName',
      },
      {
        header: 'Quarter',
        accessorKey: 'quarter',
      },
      {
        id: 'action',
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ row: { original } }) => <Amount original={original} />,
      },
    ],
  };

  const [budgetYearDisbursement, setBudgetYearDisbursement] = useState<
    Record<string, any>[]
  >([
    {
      budgetYearId: budgetYearWithApp?.items?.[0].app.budgetYearId,
      budgetYearName: budgetYearWithApp?.items?.[0].app.budgetYear,
      amount: 0,
      quarter: '1st Quarter',
      order: 0,
    },
    {
      budgetYearId: budgetYearWithApp?.items?.[0].app.budgetYearId,
      budgetYearName: budgetYearWithApp?.items?.[0].app.budgetYear,
      amount: 0,
      quarter: '2nd Quarter',
      order: 0,
    },
    {
      budgetYearId: budgetYearWithApp?.items?.[0].app.budgetYearId,
      budgetYearName: budgetYearWithApp?.items?.[0].app.budgetYear,
      amount: 0,
      quarter: '3rd Quarter',
      order: 0,
    },
    {
      budgetYearId: budgetYearWithApp?.items?.[0].app.budgetYearId,
      budgetYearName: budgetYearWithApp?.items?.[0].app.budgetYear,
      amount: 0,
      quarter: '4th Quarter',
      order: 0,
    },
  ]);

  const handleAdd = () => {
    // const lastYear = budgetYear[budgetYear.length - 1];
    // if (
    //   budgetYear.reduce((item, sum) => (item + sum.amount) as number, 0) >=
    //   100
    // ) {
    //   return;
    // } else {
    //   setBudgetYear([
    //     ...budgetYear,
    //     { year: lastYear.year + 1, amount: 0 },
    //   ]);
    // }
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
        budgetYearId: budgetYearWithApp?.items?.[0].app.budgetYearId,
        budgetYearName: budgetYearWithApp?.items?.[0].app.budgetYear,
      }));

      setBudgetYearDisbursement(temp);
    }
  }, [budgetYearWithApp]);

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
      <Table config={config} data={budgetYearDisbursement} />

      <Group justify="end" className="mt-2">
        <Divider h={2} />
        <Button loading={isDisbursementCreating} onClick={onSave}>
          Save
        </Button>
      </Group>
    </Box>
  );
};
