'use client';

import { useGetPreBudgetPlansQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
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

export const PlanYearTab = () => {
  const { data } = useGetPreBudgetPlansQuery({} as any);
  const { budgetYear } = useParams();
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState({});
  const btnStyle =
    'w-fit px-3 py-1 bg-white cursor-pointer border-l border-r border-t hover:shadow-lg ';
  const [opened, { toggle }] = useDisclosure(true);
  const [modalOpened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const tempData = data?.items?.filter((d) => d.id == budgetYear) ?? [];
    setSelectedYear(tempData[0]);
  }, [budgetYear]);
  return (
    <Box className="mb-2">
      <Flex>
        {data?.items?.map((d) => (
          <Box
            className={
              budgetYear == d.id
                ? btnStyle + ' font-bold'
                : btnStyle + ' border-b'
            }
            key={d.id}
            onClick={() => router.push(`/post-budget-plan/${d.id}/activities`)}
          >
            {d.app.budgetYear}
          </Box>
        ))}

        {data?.items?.length === 1 && (
          <Box
            className={
              'w-fit px-3 py-1 cursor-pointer border-l border-r border-t hover:shadow-lg bg-gray-300 '
            }
            onClick={open}
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
            <Badge color="yellow" size="sm" radius="md">
              Draft
            </Badge>
          </Group>
          <Button>Submit</Button>
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
              <Text> Draft</Text>
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
              <Text>20% MG</Text>
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
