'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Collapse,
  Flex,
  Group,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import {
  IconChartBar,
  IconChevronDown,
  IconChevronUp,
  IconCoins,
  IconPennantFilled,
  IconPointFilled,
} from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLazyReadQuery } from '../procurement-requisition/_api/procurement-requisition.api';
import { logger } from '@megp/core-fe';

export const PlanYearTab = ({ collapsed }: { collapsed: boolean }) => {
  const [mode, setMode] = useState('plan');
  const [triggerPr, { data: pr }] = useLazyReadQuery();
  const [opened, { toggle }] = useDisclosure(collapsed);
  const { id } = useParams();
  useEffect(() => {
    id !== undefined && setMode('pr');
  }, [id]);

  const badgeColor = {
    Draft: 'yellow',
    Submitted: 'blue',
    Approved: 'green',
    Adjust: 'yellow',
    Adjusted: 'blue',
  };

  useEffect(() => {
    triggerPr(id?.toString());
  }, [id, triggerPr]);
  logger.log(pr);

  return (
    <Box className="mb-2">
      <Box className=" p-2 bg-white rounded">
        <Flex justify="space-between">
          <Group>
            <Text fw="500" className="text-lg">
              {mode === 'pr' ? pr?.title : ' Annual procurement Plan 2024'}
            </Text>
            <Badge
              color={badgeColor[(pr as any)?.status] ?? 'yellow'}
              size="sm"
              radius="md"
            >
              {(pr as any)?.status}
            </Badge>
          </Group>
        </Flex>
        <Collapse in={opened}>
          <Flex justify="space-between" mt={20}>
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
              <Text> {(pr as any)?.status}</Text>
            </Group>
          </Flex>

          <Flex justify="space-between" mt={20}>
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
    </Box>
  );
};
