import { Text, Group, Badge, Paper, Flex, Button } from '@mantine/core';
import style from './stats-card.module.scss';
import { ApplicationService } from '@/models/vendorRegistration';
import { IconEye } from '@tabler/icons-react';
interface StatsListProps {
  name: string;
  tinNumber: string;
  serviceStatus: string;
  serviceRemark: string;
  category: string;
  serviceActionType: string;
  trackingNum: string;
  date: string;
}
const badgeColor: { [key: string]: string } = {
  Rejected: 'red.4',
  Submitted: 'blue.4',
  Adjust: 'yellow.4',
  Completed: 'Green.4',
  Pending: 'blue.4',
};
export function StatsListCard(data: ApplicationService) {
  return (
    <Paper className={style.card} withBorder>
      <Flex className="flex-col justify-between h-full">
        <Group justify="space-between" align="start">
          <Flex className="flex-col gap-3">
            <Badge size="sm" color={badgeColor[data.serviceStatus]}>
              {data.serviceStatus}
            </Badge>
            <Text ta="left" fw={600} fz="sm">
              <span className="font-bold text-gray-400">Tracking Number: </span>
              {data.trackingNumber}Tr32445
            </Text>
          </Flex>

          <Text c="dimmed" ta="left" fz="xs">
            11/20/2023
          </Text>
        </Group>
        <Group justify="space-between" align="start">
          <Text ta="left" fw={600} fz="sm">
            <span className="font-bold text-gray-400">Category: </span>
            {data.category}
          </Text>
        </Group>
        <Group justify="flex-end" align="start">
          <Flex className="flex-col items-center">
            <Button variant="outline">view</Button>
          </Flex>
        </Group>
      </Flex>
    </Paper>
  );
}
