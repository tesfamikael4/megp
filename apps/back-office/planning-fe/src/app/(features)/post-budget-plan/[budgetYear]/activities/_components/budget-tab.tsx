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
import { Table, TableConfig, logger } from '@megp/core-fe';
import { notifications } from '@mantine/notifications';

export const BudgetTab = () => {
  const [getActivity, { data, isLoading }] = useLazyReadQuery();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const config: TableConfig<any> = {
    columns: [
      {
        header: 'Budget Year',
        accessorKey: 'year',
      },
      {
        header: 'Allocated Percentage',
        accessorKey: 'percentage',
        cell: ({ row: { original } }) => (
          <AllocatedPercentage original={original} />
        ),
      },
      {
        header: () => <p className="text-right"> Allocated Budget</p>,
        accessorKey: 'budget',
        cell: ({ row: { original } }: any) => (
          <p className="text-right">
            {(
              (original.percentage / 100) *
              data?.totalEstimatedAmount
            ).toLocaleString('en-US', {
              style: 'currency',
              currency: data?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        ),
      },
    ],
  };
  const { id } = useParams();
  const [budgetYear, setBudgetYear] = useState<Record<string, number>[]>([]);

  const handleAdd = () => {
    const lastYear = budgetYear[budgetYear.length - 1];
    if (
      budgetYear.reduce((item, sum) => (item + sum.percentage) as number, 0) >=
      100
    ) {
      return;
    } else {
      setBudgetYear([
        ...budgetYear,
        { year: lastYear.year + 1, percentage: 0 },
      ]);
    }
  };

  const AllocatedPercentage = ({ original }: any) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    const [perc, setPerc] = useState(original.percentage);
    const onBlur = () => {
      setIsEditorOpened(false);
      const temp = budgetYear.map((b) => {
        if (b.year === original.year) {
          return { ...b, percentage: parseInt(perc) };
        }
        return b;
      });

      setBudgetYear([...temp]);
    };
    return (
      <>
        {!isEditorOpened && (
          <Text onClick={() => setIsEditorOpened(true)}>
            {original.percentage}%
          </Text>
        )}
        {isEditorOpened && (
          <>
            <TextInput
              value={perc}
              type="number"
              onChange={(value) => {
                setPerc(value.target.value);
              }}
              onBlur={onBlur}
              className="w-1/2"
              rightSection="%"
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
    if (data) {
      setBudgetYear(data?.multiYearBudget ?? []);
    }
  }, [data]);

  const onSave = async () => {
    try {
      await update({ ...data, multiYearBudget: budgetYear });
      notifications.show({
        title: 'Success',
        message: 'Updated Successfully',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };
  return (
    <Box className="mt-2" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <BudgetSelector />

      {data?.isMultiYear && (
        <Box className="mt-2">
          {budgetYear.reduce(
            (item, sum) => (item + sum.percentage) as number,
            0,
          ) <= 100 && (
            <Flex justify="end" align="center" className="mt-2 text-slate-500 ">
              <IconPlus size="16" />
              <Text fw="500" onClick={handleAdd} className="cursor-pointer">
                Add
              </Text>
            </Flex>
          )}
          <Table config={config} data={budgetYear} />
        </Box>
      )}

      <Group justify="end" className="mt-2">
        <Divider h={2} />
        <Button loading={isUpdating} onClick={onSave}>
          Save
        </Button>
      </Group>
    </Box>
  );
};
