import { Text, Group, Badge, Paper, Flex, Button } from '@mantine/core';
import style from './stats-card.module.scss';
import { ApplicationService } from '@/models/vendorRegistration';
import { IconEye } from '@tabler/icons-react';
import { Application } from './application-list';

interface Props {
  data: Application;
  view: (data: any) => void;
}
const badgeColor: { [key: string]: string } = {
  Rejected: 'red.4',
  Submitted: 'blue.4',
  Adjust: 'yellow.4',
  Completed: 'Green.4',
  Pending: 'blue.4',
};
export const StatsListCard: React.FC<Props> = ({ data, view }) => {
  return (
    <Paper className={style.card} withBorder>
      <Flex className="flex-col justify-between h-full">
        <Group justify="space-between" align="start">
          <Flex className="flex-col gap-3">
            <Badge size="sm" color={badgeColor[data.serviceStatus]}>
              {data.serviceStatus}
            </Badge>
            <Text ta="left" fw={500} fz="sm">
              <span className=" text-gray-400">Tracking Number: </span>
              {data.trackingNumber}Tr32445
            </Text>
          </Flex>

          <Text c="dimmed" ta="left" fz="xs">
            11/20/2023
          </Text>
        </Group>
        <Group justify="space-between" align="start">
          <Text ta="left" fw={500} fz="xs">
            <span className=" text-gray-400">Category: </span>
            {data.category}
          </Text>
        </Group>
        <Group justify="flex-end" align="start">
          <Flex className="flex-col items-center">
            <Button variant="outline" onClick={() => view(data)}>
              view
            </Button>
          </Flex>
        </Group>
      </Flex>
    </Paper>
  );
};
