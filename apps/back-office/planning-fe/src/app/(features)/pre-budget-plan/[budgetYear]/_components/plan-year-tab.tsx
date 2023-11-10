'use client';

import { useGetPreBudgetPlansQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { Box, Button, Flex, Group, Text } from '@mantine/core';
import { Section } from '@megp/core-fe';
import {
  IconCoins,
  IconPennantFilled,
  IconPercentage,
  IconTrekking,
} from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const PlanYearTab = () => {
  const { data } = useGetPreBudgetPlansQuery({} as any);
  const { budgetYear } = useParams();
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState({});
  const btnStyle =
    'w-fit px-3 py-1 bg-white cursor-pointer border hover:shadow-lg ';

  useEffect(() => {
    const tempData = data?.items?.filter((d) => d.id == budgetYear) ?? [];
    setSelectedYear(tempData[0]);
  }, [budgetYear]);
  return (
    <Box>
      <Flex>
        {data?.items?.map((d) => (
          <Box
            className={budgetYear == d.id ? btnStyle + ' font-bold' : btnStyle}
            key={d.id}
            onClick={() => router.push(`/pre-budget-plan/${d.id}/activities`)}
          >
            {d.app.budgetYear}
          </Box>
        ))}
      </Flex>
      <Section
        collapsible={false}
        title={(selectedYear as any)?.app?.planName}
        action={<Button>Submit</Button>}
        className="mb-2"
      >
        <Flex justify="space-between">
          <Group>
            <IconCoins />
            <Text>USD, 1,525,520.68</Text>
          </Group>
          <Group>
            <IconPercentage />
            <Text> 71 % Indigenous</Text>
          </Group>
          <Group>
            <IconTrekking />
            <Text> 27 Activities</Text>
          </Group>
          <Group>
            <IconPennantFilled />
            <Text> Draft</Text>
          </Group>
        </Flex>
      </Section>
    </Box>
  );
};
