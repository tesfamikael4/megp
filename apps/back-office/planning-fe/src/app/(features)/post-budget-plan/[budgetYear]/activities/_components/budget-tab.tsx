import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Text,
} from '@mantine/core';
import { BudgetSelector } from './budget-selectorr';
import { useLazyReadQuery } from '../_api/activities.api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { logger, notify } from '@megp/core-fe';
import {
  useCreatePostBudgetDisbursementMutation,
  useLazyGetPostBudgetDisbursementQuery,
  useGetPostBudgetPlansQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { BudgetForm } from './budget-form';

export const BudgetTab = ({ disableFields }: { disableFields?: boolean }) => {
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

  const [budgetYearDisbursement, setBudgetYearDisbursement] = useState<any[]>([
    {
      budgetYear: budgetYearWithApp?.items?.[0].app.budgetYear,
      amount: 0,
      quarter1: '0',
      quarter2: '0',
      quarter3: '0',
      quarter4: '0',
    },
  ]);
  const config = {
    idAccessor: 'budgetYear',
    isExpandable: true,
    expandedRowContent: (record) => {
      return (
        <BudgetForm
          disableFields={disableFields}
          data={record}
          onDone={(data) => {
            const amount =
              data.quarter1 + data.quarter2 + data.quarter3 + data.quarter4;
            const temp = budgetYearDisbursement.map((d) => {
              if (d.budgetYear === record.budgetYear) {
                return { ...d, ...data, amount };
              }
              return d;
            });

            logger.log({ temp });

            setBudgetYearDisbursement(temp);
          }}
          disableRemove={
            budgetYearWithApp?.items?.[0].app.budgetYear === record.budgetYear
          }
          onRemove={() => {
            const temp = budgetYearDisbursement.filter(
              (d) => d.budgetYear !== record.budgetYear,
            );
            setBudgetYearDisbursement(temp);
          }}
        />
      );
    },
    columns: [
      {
        title: 'Budget Year',
        accessor: 'budgetYear',
      },
      {
        title: '1st Quarter',
        accessor: 'quarter1',
        textAlign: 'right',
        render: (record) => (
          <p>
            {parseInt(record.quarter1).toLocaleString('en-US', {
              style: 'currency',
              currency: data?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        title: '2nd Quarter',
        accessor: 'quarter2',
        textAlign: 'right',
        render: (record) => (
          <p>
            {parseInt(record.quarter2).toLocaleString('en-US', {
              style: 'currency',
              currency: data?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        title: '3rd Quarter',
        accessor: 'quarter3',
        textAlign: 'right',
        render: (record) => (
          <p>
            {parseInt(record.quarter3).toLocaleString('en-US', {
              style: 'currency',
              currency: data?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        title: '4th Quarter',
        accessor: 'quarter4',
        textAlign: 'right',
        render: (record) => (
          <p>
            {parseInt(record.quarter4).toLocaleString('en-US', {
              style: 'currency',
              currency: data?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        title: 'Total Amount',
        accessor: 'amount',
        textAlign: 'right',
        render: (record) => (
          <p>
            {parseInt(record.amount).toLocaleString('en-US', {
              style: 'currency',
              currency: data?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
    ],
  };

  const handleAdd = () => {
    const lastYear = budgetYearDisbursement[budgetYearDisbursement.length - 1];
    const budgetYear = parseInt(lastYear.budgetYear) + 1;

    const temp = {
      budgetYear: budgetYear.toString(),
      amount: 0,
      quarter1: '0',
      quarter2: '0',
      quarter3: '0',
      quarter4: '0',
    };

    logger.log({ temp });
    setBudgetYearDisbursement([...budgetYearDisbursement, temp]);
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

        budgetYear:
          b.budgetYear ?? budgetYearWithApp?.items?.[0].app.budgetYear,
      }));

      setBudgetYearDisbursement(temp);
    }
  }, [budgetYearDisbursement, budgetYearWithApp]);

  useEffect(() => {
    getDisbursement(id as string);
  }, [getDisbursement, id]);

  const onSave = async () => {
    logger.log({ budgetYearDisbursement });
    const castedData = budgetYearDisbursement.map((b) => ({
      ...b,
      currency: data?.currency,
    }));
    logger.log({ castedData });
    try {
      await createDisbursement({
        data: castedData,
        postBudgetPlanActivityId: id,
      });
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
      <BudgetSelector activity={data} disableFields={disableFields} />

      <Box className="mt-5">
        <Divider label="Disbursement" my="lg" />
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
