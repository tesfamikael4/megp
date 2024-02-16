'use client';

import {
  useLazyGetPostBudgetPlanAnalyticsQuery,
  useLazyGetPostBudgetPlansQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';
import {
  Avatar,
  Badge,
  Box,
  Collapse,
  Flex,
  Group,
  LoadingOverlay,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp, IconCoins } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StatisticCard } from '@/app/(features)/(app)/_components/statistic-card';

const ReportTab = () => {
  const { budgetYear } = useParams();
  const badgeColor = {
    Draft: 'yellow',
    Submitted: 'blue',
    Approved: 'green',
    Adjust: 'yellow',
    Adjusted: 'blue',
  };

  //states
  const [opened, { toggle }] = useDisclosure(true);
  const [selectedYear, setSelectedYear] = useState({});
  const [analytics, setAnalytics] = useState<any>({});

  // rtk queries
  const [getPost, { data: post }] = useLazyGetPostBudgetPlansQuery();

  const [
    getPostAnalytics,
    {
      data: postAnalytics,
      isLoading: isLoadingPostAnalytics,
      isSuccess: isPostAnalyticsSucess,
    },
  ] = useLazyGetPostBudgetPlanAnalyticsQuery();

  //use Effect
  useEffect(() => {
    getPost({} as any);
  }, [getPost]);

  useEffect(() => {
    const tempData = post?.items?.filter((d) => d.id == budgetYear) ?? [];
    setSelectedYear(tempData[0]);
  }, [budgetYear, post]);

  useEffect(() => {
    getPostAnalytics(budgetYear as string);
  }, [budgetYear, getPostAnalytics]);

  useEffect(() => {
    if (isPostAnalyticsSucess) {
      setAnalytics(postAnalytics);
    }
  }, [isPostAnalyticsSucess, postAnalytics]);

  return (
    <Box>
      <Box className="bg-white mb-2 rounded-r-md rounded-b-md">
        <Flex align="center" justify="space-between" className=" p-2 border-b">
          <Group>
            <Text className="font-semibold">
              {(selectedYear as any)?.app?.planName}
            </Text>
            <Badge
              color={badgeColor[(selectedYear as any)?.status] ?? 'yellow'}
            >
              {(selectedYear as any)?.status}
            </Badge>
          </Group>
          <Group>
            {opened ? (
              <IconChevronUp className="cursor-pointer" onClick={toggle} />
            ) : (
              <IconChevronDown className="cursor-pointer" onClick={toggle} />
            )}
          </Group>
        </Flex>
        <Collapse in={opened} pos="relative">
          <LoadingOverlay visible={isLoadingPostAnalytics} />
          <Flex>
            <Box className="w-3/4">
              <Flex>
                <StatisticCard
                  title="IBM"
                  value={analytics?.targetGroupPercentages?.IBM ?? 0}
                  minValue={50}
                  type="targetGroup"
                />
                <StatisticCard
                  title="Activities"
                  value={analytics?.totalActivities ?? 0}
                  type="activity"
                />
                <StatisticCard
                  title="Status"
                  value={(selectedYear as any)?.status}
                  type="status"
                />
              </Flex>
              <Flex>
                <StatisticCard
                  title="MSME"
                  value={analytics?.targetGroupPercentages?.MSME ?? 0}
                  minValue={50}
                  type="targetGroup"
                />
                <StatisticCard
                  title="Marginalized Group"
                  value={
                    analytics?.targetGroupPercentages?.['Marginalized Group'] ??
                    0
                  }
                  minValue={50}
                  type="targetGroup"
                />
                <StatisticCard
                  title="Others"
                  value={analytics?.targetGroupPercentages?.Others ?? 0}
                  minValue={50}
                  type="targetGroup"
                />
              </Flex>
            </Box>
            <Box className="p-2 border-r border-b w-1/4 cursor-pointer">
              <Flex gap="sm">
                <Avatar radius="xl" color="gray">
                  <IconCoins />
                </Avatar>
                <Box>
                  <Text className="text-slate-500 text-xs">
                    Total Estimated Amount
                  </Text>
                  {Object.keys(analytics?.currencyTotalAmounts ?? {}).length ===
                    0 && (
                    <Text className="font-semibold  text-end">MKW 0.00</Text>
                  )}
                  {Object.keys(analytics?.currencyTotalAmounts ?? {}).map(
                    (currency, index) => {
                      if (index == 0)
                        return (
                          <Text className="font-semibold  text-end">
                            {analytics?.currencyTotalAmounts?.[
                              currency
                            ].toLocaleString('en-US', {
                              style: 'currency',
                              currency: currency,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                              currencyDisplay: 'code',
                            })}
                          </Text>
                        );

                      return (
                        <Text
                          className="font-semibold  text-end"
                          key={currency}
                        >
                          {analytics?.currencyTotalAmounts?.[
                            currency
                          ].toLocaleString('en-US', {
                            style: 'currency',
                            currency: currency,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            currencyDisplay: 'code',
                          })}
                        </Text>
                      );
                    },
                  )}
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Collapse>
      </Box>
    </Box>
  );
};

export default ReportTab;
