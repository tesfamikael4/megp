'use client';

import {
  useApprovePostBudgetMutation,
  useLazyGetPostBudgetPlanAnalyticsQuery,
  useLazyGetPostBudgetPlansQuery,
  useLazyIsValidPostPlanQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';
import {
  useApprovePreBudgetMutation,
  useCreateAppMutation,
  useLazyGetApprovalDocumentsQuery,
  useLazyGetPreBudgetPlanAnalyticsQuery,
  useLazyGetPreBudgetPlansQuery,
  useLazyIsValidPlanQuery,
} from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { logger, notify } from '@megp/core-fe';
import {
  IconChevronDown,
  IconChevronUp,
  IconCoins,
  IconInfoCircle,
  IconPlus,
} from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StatisticCard } from './statistic-card';
import { useCanSubmitQuery } from '@/store/api/workflow/workflow.api';
import { HistoryBtn } from './history-btn';

const PlanningTab = ({ page }: { page: 'pre' | 'post' }) => {
  const { budgetYear, documentId } = useParams();
  const router = useRouter();
  const btnStyle =
    'w-fit px-3 py-1 bg-white cursor-pointer border-l border-r border-t hover:shadow-lg ';
  const badgeColor = {
    Draft: 'yellow',
    Submitted: 'blue',
    Approved: 'green',
    Adjust: 'yellow',
    Adjusted: 'blue',
  };

  //states
  const [opened, { toggle }] = useDisclosure(false);
  const [selectedYear, setSelectedYear] = useState({});
  const [analytics, setAnalytics] = useState<any>({});

  // rtk queries
  const [appCreate] = useCreateAppMutation();
  const [getApprovalDocuments, { data: documents }] =
    useLazyGetApprovalDocumentsQuery();
  const [getPre, { data: pre }] = useLazyGetPreBudgetPlansQuery();
  const [getPost, { data: post }] = useLazyGetPostBudgetPlansQuery();
  const [
    getPreAnalytics,
    {
      data: preAnalytics,
      isLoading: isLoadingPreAnalytics,
      isSuccess: isPreAnalyticsSucess,
    },
  ] = useLazyGetPreBudgetPlanAnalyticsQuery();
  const [
    getPostAnalytics,
    {
      data: postAnalytics,
      isLoading: isLoadingPostAnalytics,
      isSuccess: isPostAnalyticsSucess,
    },
  ] = useLazyGetPostBudgetPlanAnalyticsQuery();
  const [approve, { isLoading }] = useApprovePreBudgetMutation();
  const [approvePost, { isLoading: isPostApproveLoading }] =
    useApprovePostBudgetMutation();
  const [isValidPrePlan, { isLoading: isValidPrePlanLoading }] =
    useLazyIsValidPlanQuery();
  const [isValidPostPlan, { isLoading: isValidPostPlanLoading }] =
    useLazyIsValidPostPlanQuery();

  const { data: canSubmit } = useCanSubmitQuery(
    page == 'pre' ? 'preBudgetApproval' : 'postBudgetApproval',
  );

  // helper functions
  const createApp = () => {
    modals.openConfirmModal({
      title: ` New Annual Procurement Plan`,
      centered: true,
      children: (
        <Text size="sm">
          {`Create Annual Procurement Plan ${
            Number((selectedYear as any).app.budgetYear) + 1
          } ?`}
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      onConfirm: onAppCreate,
    });
  };

  const onAppCreate = async () => {
    try {
      const res = await appCreate('next').unwrap();
      close();
      notify('Success', 'APP Created successfully');
      router.push(`/pre-budget-plan/${res?.preBudgetPlans?.id}/activities`);
    } catch (err) {
      if (err.status === 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };

  const submitPlan = () => {
    modals.openConfirmModal({
      title: ` ${(selectedYear as any)?.app.planName}`,
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to submit  APP ${
            (selectedYear as any)?.app.budgetYear
          }?  (${page == 'pre' ? 'Pre-Budget' : 'Post-Budget'})`}
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      onConfirm: handelSubmit,
    });
  };

  const handelSubmit = async () => {
    try {
      if (page == 'pre') {
        await approve({
          id: (selectedYear as any)?.id,
          itemName: (selectedYear as any)?.app?.planName,
        }).unwrap();
      } else {
        await approvePost({
          id: (selectedYear as any)?.id,
          itemName: (selectedYear as any)?.app?.planName,
        }).unwrap();
      }
      notify(
        'Success',
        (page == 'pre' ? 'Pre' : 'Post') +
          ' budget plan submitted successfully',
      );
    } catch (err) {
      logger.log(err);
      if (err.status === 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };

  const IBMWarningTitle = () => (
    <Flex gap={5} align={'center'}>
      <IconInfoCircle size={14} color="red" />
      <p className="font-semibold">
        Criteria for National Competitive Bidding not met.
      </p>
    </Flex>
  );

  const isValidPlan = async () => {
    try {
      const res =
        page == 'pre'
          ? await isValidPrePlan((selectedYear as any)?.id).unwrap()
          : await isValidPostPlan((selectedYear as any)?.id).unwrap();
      if (res.pass) {
        submitPlan();
      } else {
        modals.openConfirmModal({
          title: <IBMWarningTitle />,
          children: (
            <Text size="sm">
              IBM&apos;s share of National Competitive Bidding activities is
              below 60%. Confirm submission of the plan?
            </Text>
          ),
          labels: { confirm: 'Confirm', cancel: 'Cancel' },
          onConfirm: () => submitPlan(),
        });
      }
    } catch (err) {
      logger.log(err);
      notify('Error', 'Something went wrong');
    }
  };

  //use Effect
  useEffect(() => {
    if (page == 'pre') {
      getPre({
        orderBy: [{ column: 'createdAt', direction: 'ASC' }],
        skip: 0,
        take: 2,
      });
    }
    if (page == 'post') {
      getPost({
        orderBy: [{ column: 'createdAt', direction: 'ASC' }],
        skip: 0,
        take: 2,
      });
    }
  }, [getPost, getPre, page]);

  useEffect(() => {
    const tempData =
      (page == 'pre' ? pre : post)?.items?.filter((d) => d.id == budgetYear) ??
      [];
    setSelectedYear(tempData[0]);
  }, [budgetYear, pre, post, page]);

  useEffect(() => {
    if (page == 'pre') {
      getPreAnalytics(budgetYear as string);
    }
    if (page == 'post') {
      getPostAnalytics(budgetYear as string);
    }
  }, [budgetYear, getPreAnalytics, page]);

  useEffect(() => {
    if (page == 'pre' && isPreAnalyticsSucess) {
      setAnalytics(preAnalytics);
    }
    if (page == 'post' && isPostAnalyticsSucess) {
      setAnalytics(postAnalytics);
    }
  }, [
    isPostAnalyticsSucess,
    isPreAnalyticsSucess,
    page,
    postAnalytics,
    preAnalytics,
  ]);

  useEffect(() => {
    if ((selectedYear as any)?.status == 'Draft')
      getApprovalDocuments(budgetYear);
  }, [budgetYear, getApprovalDocuments, selectedYear]);

  return (
    <Box>
      <Flex>
        {(page == 'pre' ? pre : post)?.items?.map((d) => (
          <Box
            className={
              budgetYear == d.id
                ? btnStyle + ' font-bold'
                : btnStyle + ' border-b'
            }
            key={d.id}
            onClick={() =>
              router.push(`/${page}-budget-plan/${d.id}/activities`)
            }
          >
            {d.app.budgetYear}
          </Box>
        ))}

        {(page == 'pre' ? pre : post)?.items?.length === 1 && (
          <Box
            className={
              'w-fit px-3 py-1 cursor-pointer border-l border-r border-t hover:shadow-lg bg-gray-300 '
            }
            onClick={createApp}
          >
            <Flex align="center">
              <IconPlus size={16} />
              <Text>Add</Text>
            </Flex>
          </Box>
        )}
      </Flex>
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
          <Group gap={5}>
            {page == 'post' && <HistoryBtn />}

            {(selectedYear as any)?.status == 'Draft' &&
              documents &&
              documents.length > 0 && (
                <Select
                  placeholder="Comments"
                  value={(documentId as string) ?? ''}
                  data={documents?.map((document) => ({
                    label: `Version ${document.version}`,
                    value: document.id,
                  }))}
                  size="xs"
                  onChange={(value) => {
                    const link = `/${page}-budget-plan/${budgetYear}/document/${value}`;
                    if (value !== null) {
                      if (documentId) {
                        router.push(link);
                      } else {
                        open('/planning' + link);
                      }
                    }
                  }}
                  width={50}
                />
              )}
            <Button
              // onClick={submitPlan}
              onClick={isValidPlan}
              loading={
                isLoading ||
                isPostApproveLoading ||
                isValidPrePlanLoading ||
                isValidPostPlanLoading
              }
              disabled={
                (page == 'pre' &&
                  (selectedYear as any)?.status != 'Draft' &&
                  (selectedYear as any)?.status != 'Adjust') ||
                canSubmit == false ||
                (page == 'post' &&
                  (selectedYear as any)?.status === 'Submitted')
              }
            >
              {(selectedYear as any)?.status != 'Draft' &&
              (selectedYear as any)?.status != 'Adjust'
                ? 'Submitted'
                : 'Submit'}
            </Button>
            {opened ? (
              <IconChevronUp className="cursor-pointer" onClick={toggle} />
            ) : (
              <IconChevronDown className="cursor-pointer" onClick={toggle} />
            )}
          </Group>
        </Flex>
        <Collapse in={opened} pos="relative">
          <LoadingOverlay
            visible={isLoadingPreAnalytics || isLoadingPostAnalytics}
          />
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
                  value={
                    analytics?.targetGroupPercentages?.['MSM Enterprises'] ?? 0
                  }
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

export default PlanningTab;
