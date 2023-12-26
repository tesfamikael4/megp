'use client';

import {
  useApprovePreBudgetMutation,
  useCreateAppMutation,
  useGetPreBudgetPlansQuery,
  useLazyGetPreBudgetPlansQuery,
} from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Group,
  Modal,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import {
  IconChartBar,
  IconChevronDown,
  IconChevronUp,
  IconCoins,
  IconPennantFilled,
  IconPlus,
  IconPointFilled,
} from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormDetail } from './form-detail';
import { logger } from '@megp/core-fe';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  useGetPostBudgetPlansQuery,
  useLazyGetPostBudgetPlansQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';

export const PlanYearTab = ({ page }: { page: 'pre' | 'post' }) => {
  const [getPre, { data: pre }] = useLazyGetPreBudgetPlansQuery();
  const [getPost, { data: post }] = useLazyGetPostBudgetPlansQuery();
  const { budgetYear } = useParams();
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState({});
  const btnStyle =
    'w-fit px-3 py-1 bg-white cursor-pointer border-l border-r border-t hover:shadow-lg ';
  const [opened, { toggle }] = useDisclosure(true);
  const [modalOpened, { close }] = useDisclosure(false);
  const [approve, { isLoading }] = useApprovePreBudgetMutation();
  const [appCreate] = useCreateAppMutation();

  const badgeColor = {
    Draft: 'yellow',
    Submitted: 'blue',
    Approved: 'green',
    Adjust: 'yellow',
    Adjusted: 'blue',
  };

  const submitPlan = () => {
    modals.openConfirmModal({
      title: ` ${(selectedYear as any)?.app.planName}`,
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to submit  APP ${(selectedYear as any)?.app
            .budgetYear}?  (Pre-Budget)`}
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      onConfirm: handelSubmit,
    });
  };

  const onAppCreate = async () => {
    try {
      const res = await appCreate('next').unwrap();
      close();
      notifications.show({
        title: 'Success',
        message: 'APP Created successfully',
        color: 'green',
      });
      router.push(`/pre-budget-plan/${res.id}/activities`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };

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

  const handelSubmit = async () => {
    try {
      await approve((selectedYear as any)?.id).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Pre budget plan submitted successfully',
        color: 'green',
      });
    } catch (err) {
      logger.log(err);
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    const tempData =
      (page == 'pre' ? pre : post)?.items?.filter((d) => d.id == budgetYear) ??
      [];
    setSelectedYear(tempData[0]);
  }, [budgetYear, pre, post, page]);

  useEffect(() => {
    if (page == 'pre') {
      getPre({} as any);
    }
    if (page == 'post') {
      getPost({} as any);
    }
  }, [getPost, getPre, page]);
  return (
    <Box className="mb-2">
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
      <Box className=" p-2 bg-white rounded">
        <Flex justify="space-between">
          <Group>
            <Text fw="500" className="text-lg">
              {(selectedYear as any)?.app?.planName}
            </Text>
            <Badge
              color={badgeColor[(selectedYear as any)?.status] ?? 'yellow'}
              size="sm"
              radius="md"
            >
              {(selectedYear as any)?.status}
            </Badge>
          </Group>
          <Button
            onClick={submitPlan}
            loading={isLoading}
            disabled={
              (selectedYear as any)?.status != 'Draft' &&
              (selectedYear as any)?.status != 'Adjust'
            }
          >
            {(selectedYear as any)?.status != 'Draft' &&
            (selectedYear as any)?.status != 'Adjust'
              ? 'Submitted'
              : 'Submit'}
          </Button>
        </Flex>
        <Collapse in={opened}>
          <Flex justify="space-between" mt={20}>
            <Group className="w-1/4">
              <IconCoins />
              <Text>MKW, 1,525,520.68</Text>
            </Group>
            <Group className="w-1/4">
              <IconCoins />
              <Text>USD, 1,525,520.68</Text>
            </Group>
            <Group className="w-1/4">
              <IconChartBar />
              <Text> 27 Activities</Text>
            </Group>
            <Group className="w-1/4">
              <IconPennantFilled />
              <Text> {(selectedYear as any)?.status}</Text>
            </Group>
          </Flex>

          <Flex justify="space-between" mt={20}>
            <Group className="w-1/4">
              <IconPointFilled className="text-yellow-400 " />
              <Text>52% IBM</Text>
            </Group>
            <Group className="w-1/4">
              <IconPointFilled className="text-yellow-400 " />
              <Text>14% MSME</Text>
            </Group>
            <Group className="w-1/4">
              <IconPointFilled className="text-green-500 " />
              <Text>20% Marginalized Group</Text>
            </Group>
            <Group className="w-1/4">
              <IconPointFilled className="text-green-500 " />
              <Text>14% Others</Text>
            </Group>
          </Flex>
        </Collapse>
        <Group justify="end">
          <ActionIcon
            variant="transparent"
            onClick={toggle}
            className="p-0 m-0"
          >
            {opened ? (
              <IconChevronUp className="p-0 m-0" />
            ) : (
              <IconChevronDown className="p-0 m-0" />
            )}
          </ActionIcon>
        </Group>
      </Box>

      <Modal
        opened={modalOpened}
        onClose={close}
        title="New Annual Procurement Plan"
      >
        <FormDetail mode="new" />
      </Modal>
    </Box>
  );
};
