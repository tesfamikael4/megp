'use client';

import {
  useReadQuery,
  useLazyGetAnalyticsQuery,
  useLazyGetTargetGroupQuery,
} from '@/store/api/pr/pr.api';
import {
  useApprovePrMutation,
  useLazyGetPrItemsQuery,
} from '@/store/api/pr/pr.api';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Group,
  LoadingOverlay,
  NumberFormatter,
  Select,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { logger, notify } from '@megp/core-fe';
import { IconChevronDown, IconChevronUp, IconCoins } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StatisticCard } from './statistic-card';
import { useLazyGetPostBudgetPlansQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';
import { useCanSubmitQuery } from '@/store/api/workflow/workflow.api';
import { useLazyGetApprovalDocumentsQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { useListByIdQuery } from '../_api/mechanization.api';
const PrTab = () => {
  const badgeColor = {
    Draft: 'yellow',
    Submitted: 'blue',
    Approved: 'green',
    Adjust: 'yellow',
    Adjusted: 'blue',
  };

  //states
  const [opened, { toggle }] = useDisclosure(false);
  const [mode, setMode] = useState('plan');
  const { id } = useParams();
  const router = useRouter();

  const { data: pr } = useReadQuery(id?.toString());

  const { data: mechanism } = useListByIdQuery({
    id: id?.toString(),
    collectionQuery: undefined,
  });

  const msmeGroups = [
    'Medium Enterprises',
    'Small Enterprises',
    'Micro Enterprises',
  ];
  const marginalizedGroups = ['Marginalized Group'];
  const ibmGroup = ['IBM'];
  const othersGroup = ['Others'];

  // Initialize counts
  let countIbM = 0;
  let countMsme = 0;
  let countMarginalized = 0;
  let countOthers = 0;

  const selectedTargetGroups = mechanism?.items?.[0]?.targetGroup;

  const totalSelected = selectedTargetGroups?.length;

  // Count the occurrences of each category
  selectedTargetGroups?.forEach((group) => {
    if (msmeGroups?.includes(group)) {
      countMsme += 1;
    } else if (marginalizedGroups.includes(group)) {
      countMarginalized += 1;
    } else if (ibmGroup?.includes(group)) {
      countIbM += 1;
    } else if (othersGroup?.includes(group)) {
      countOthers += 1;
    }
  });

  // Calculate percentages
  const percentageIbM = (countIbM / totalSelected) * 100;
  const percentageMsme = (countMsme / totalSelected) * 100;
  const percentageMarginalized = (countMarginalized / totalSelected) * 100;
  const percentageOthers = (countOthers / totalSelected) * 100;

  const { data: canSubmit } = useCanSubmitQuery('procurementRequisition');

  const [triggerItem, { data: items }] = useLazyGetPrItemsQuery();

  // rtk queries

  const [getplan, { data: plan }] = useLazyGetPostBudgetPlansQuery();

  const [approve, { isLoading }] = useApprovePrMutation();

  const [getApprovalDocuments, { data: documents }] =
    useLazyGetApprovalDocumentsQuery();

  const submitPlan = () => {
    modals.openConfirmModal({
      title: ` ${pr?.name}`,
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to submit  procurement requisition  ${pr?.name}`}
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      onConfirm: handelSubmit,
    });
  };

  const handelSubmit = async () => {
    try {
      await approve({
        id: pr?.id,
      }).unwrap();
      notify('Success', 'Procurement requisition submitted successfully');
    } catch (err) {
      if (err?.data?.statusCode == 430) {
        notify('Error', `${err?.data?.message}`);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };

  //use Effect

  useEffect(() => {
    id !== undefined && setMode('pr');
  }, [id]);

  useEffect(() => {
    getplan(undefined);
  }, [getplan]);

  useEffect(() => {
    id && triggerItem({ id: id?.toString(), collectionQuery: undefined });
  }, [id, triggerItem]);

  useEffect(() => {
    if ((pr as any)?.status == 'DRAFT') getApprovalDocuments(id);
  }, [id, getApprovalDocuments, pr]);

  return (
    <Box>
      <Box className="bg-white mb-2 rounded-r-md rounded-b-md">
        <Flex align="center" justify="space-between" className=" p-2 border-b">
          <Group>
            <Text className="font-semibold">
              {mode === 'pr' ? pr?.title : plan?.items?.planName}
            </Text>
            <Badge color={badgeColor[(pr as any)?.status] ?? 'yellow'}>
              {(pr as any)?.status}
            </Badge>
          </Group>
          <Group gap={5}>
            {(pr as any)?.status == 'DRAFT' &&
              documents &&
              documents.length > 0 && (
                <Select
                  placeholder="Comments"
                  value={(id as string) ?? ''}
                  data={documents?.map((document) => ({
                    label: `V${document.version}`,
                    value: document.id,
                  }))}
                  size="xs"
                  onChange={(value) => {
                    const link = `/procurement-requisition/${id}/document/${value}`;
                    if (value !== null) {
                      if (id) {
                        router.push(link);
                      } else {
                        open(link);
                      }
                    }
                  }}
                  width={50}
                />
              )}
            <Button
              onClick={submitPlan}
              loading={isLoading}
              disabled={
                ((pr as any)?.status != 'DRAFT' &&
                  (pr as any)?.status != 'ADJUST') ||
                canSubmit == false
              }
            >
              {(pr as any)?.status != 'DRAFT' && (pr as any)?.status != 'ADJUST'
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
          <LoadingOverlay visible={isLoading} />
          <Flex>
            <Box className="w-3/4 ">
              <Flex align="flex-center" justify={'start'}>
                <StatisticCard
                  title="IBM"
                  value={percentageIbM.toFixed(2) ?? 0}
                  minValue={50}
                  type="targetGroup"
                />
                <StatisticCard
                  title="Items"
                  value={items?.total}
                  type="activity"
                />

                <StatisticCard
                  title="Status"
                  value={(pr as any)?.status}
                  type="status"
                />
              </Flex>
              <Flex>
                <StatisticCard
                  title="MSME"
                  value={percentageMsme.toFixed(2) ?? 0}
                  minValue={50}
                  type="targetGroup"
                />
                <StatisticCard
                  title="Marginalized Group"
                  value={percentageMarginalized.toFixed(2) ?? 0}
                  minValue={50}
                  type="targetGroup"
                />
                <StatisticCard
                  title="Others"
                  value={percentageOthers.toFixed(2) ?? 0}
                  minValue={50}
                  type="targetGroup"
                />
              </Flex>
            </Box>
            <Box className="p-2 border-r border-b w-1/4 cursor-pointer hover:shadow-lg">
              <Flex gap="sm">
                <Avatar radius="xl" color="gray">
                  <IconCoins />
                </Avatar>
                <Box>
                  <Text className="text-slate-500 text-xs">
                    Total Calculated Amount
                  </Text>

                  <NumberFormatter
                    value={pr?.calculatedAmount}
                    thousandSeparator
                    prefix={`${pr?.currency} `}
                  />
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Collapse>
      </Box>
    </Box>
  );
};

export default PrTab;
