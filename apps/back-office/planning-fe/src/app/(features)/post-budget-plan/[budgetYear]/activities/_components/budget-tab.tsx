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
import { useLazyReadQuery } from '../_api/activities.api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { logger } from '@megp/core-fe';

export const BudgetTab = () => {
  const [getActivity, { data, isLoading }] = useLazyReadQuery();
  const { id } = useParams();
  const [budgetYear, setBudgetYear] = useState([
    {
      year: 2023,
      percentage: 0,
    },
  ]);

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

  useEffect(() => {
    getActivity(id as string);
  }, [getActivity, id]);
  return (
    <Box className="mt-2" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <BudgetSelector />

      {data?.isMultiYear && (
        <Box className="mt-2">
          <Divider label="Disbursement" />

          {budgetYear.map((d) => (
            <Flex className="mt-2" gap="md" key={d.year}>
              <TextInput
                value={d.year}
                disabled
                className="w-1/2"
                label="Budget Year"
              />
              <TextInput
                value={d.percentage}
                type="number"
                onChange={(value) => {
                  logger.log(value.target.value);
                  const temp = budgetYear.map((b) => {
                    if (b.year === d.year) {
                      return { ...b, percentage: parseInt(value.target.value) };
                    }
                    return b;
                  });

                  setBudgetYear([...temp]);
                }}
                label="Allocated Percentage"
                className="w-1/2"
                rightSection="%"
              />
              <TextInput
                label="Allocated Budget"
                disabled
                value={(d.percentage / 100) * data.totalEstimatedAmount}
                leftSection={data?.currency}
                className="w-1/2"
              />
            </Flex>
          ))}

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
        </Box>
      )}

      <Group justify="end" className="mt-2">
        <Divider h={2} />
        <Button>Save</Button>
      </Group>
    </Box>
  );
};
