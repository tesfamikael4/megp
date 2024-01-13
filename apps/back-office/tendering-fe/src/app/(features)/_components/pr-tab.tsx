'use client';

import { useLazyReadQuery } from '@/app/(features)/procurement-requisition/_api/procurement-requisition.api';
import { useApprovePrMutation } from '@/app/(features)/_api/approve.api';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Group,
  LoadingOverlay,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notify } from '@megp/core-fe';
import { IconChevronDown, IconChevronUp, IconCoins } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StatisticCard } from './statistic-card';
import { useLazyGetBudgetYearQuery } from '@/store/api/budget/budget-year.api';
import { useLazyListByIdQuery } from '../_api/pr-activity.api';

const PlanYearTab = () => {
  const badgeColor = {
    Draft: 'yellow',
    Submitted: 'blue',
    Approved: 'green',
    Adjust: 'yellow',
    Adjusted: 'blue',
  };

  //states
  const [opened, { toggle }] = useDisclosure(true);
  const [mode, setMode] = useState('plan');

  const [triggerPr, { data: pr }] = useLazyReadQuery();
  const { id } = useParams();
  const [trigger, { data: assignedActivity }] = useLazyListByIdQuery();

  // rtk queries

  const [getplan, { data: plan }] = useLazyGetBudgetYearQuery();

  const [approve, { isLoading }] = useApprovePrMutation();

  const submitPlan = () => {
    modals.openConfirmModal({
      title: ` ${pr?.title}`,
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to submit  APP ${pr?.title}?  (Pre-Budget)`}
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
        itemName: pr.planName,
      }).unwrap();
      notify('Success', 'Procurement requisition submitted successfully');
    } catch (err) {
      if (err.status === 430) {
        notify('Error', err.data.message);
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
    triggerPr(id?.toString());
  }, [id, triggerPr]);

  useEffect(() => {
    getplan(undefined);
  }, [getplan]);

  useEffect(() => {
    trigger({
      id: id.toString(),
      collectionQuery: undefined,
    });
  }, [id, trigger]);

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
          <Group>
            <Button
              onClick={submitPlan}
              loading={isLoading}
              disabled={
                (pr as any)?.status != 'Draft' &&
                (pr as any)?.status != 'Adjust'
              }
            >
              {(pr as any)?.status != 'Draft' && (pr as any)?.status != 'Adjust'
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
                  title="Activities"
                  value={assignedActivity?.items.length ?? 0}
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
                  title="Marginalized Group"
                  value={
                    pr?.targetGroupPercentages?.['Marginalized Group'] ?? 0
                  }
                  minValue={50}
                  type="targetGroup"
                />
                <StatisticCard
                  title="Others"
                  value={pr?.targetGroupPercentages?.Others ?? 0}
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

                  {Object.keys(pr?.calculatedAmount ?? {}) && (
                    <Text className="font-semibold  text-end">
                      {pr?.calculatedAmount?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: pr?.currency,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        currencyDisplay: 'code',
                      })}
                    </Text>
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

export default PlanYearTab;
