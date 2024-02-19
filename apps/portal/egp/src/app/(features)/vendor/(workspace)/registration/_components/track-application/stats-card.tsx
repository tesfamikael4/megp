import { Text, Group, Badge, Paper, Flex, Button } from '@mantine/core';
import style from './stats-card.module.scss';
import { ApplicationInfo } from '@/models/vendorRegistration';
import { IconEye } from '@tabler/icons-react';

interface Props {
  data: ApplicationInfo;
  view: (data: any) => void;
}
const badgeColor: { [key: string]: string } = {
  Rejected: 'red.6',
  Submitted: 'blue.7',
  Adjustment: 'yellow.6',
  Completed: 'green.8',
  Pending: 'blue.8',
  Outdated: 'orange.8',
};
export const StatsListCard: React.FC<Props> = ({ data, view }) => {
  return (
    <Paper shadow="xs" withBorder className={style.card}>
      <Flex className="flex-col justify-between h-full">
        <Group justify="space-between" align="start">
          <Flex className="flex-col gap-3">
            <Badge size="xs" color={badgeColor[data.status]}>
              <Text fw={500} fz={10}>
                {data.status}
              </Text>
            </Badge>
            <Text ta="left" fw={600} fz="sm">
              <span className=" text-gray-500">Tracking Number: </span>
              {data.applicationNumber}
            </Text>
          </Flex>

          <Text c="dimmed" ta="left" fz="xs">
            {data.approvedAt}
          </Text>
        </Group>
        <Group justify="space-between" align="start">
          <Text ta="left" fw={600} fz="xs">
            <span className=" text-gray-500">Category: </span>
            {data.category}
          </Text>
        </Group>
        <Group justify="space-between" align="start">
          <Text ta="left" fw={600} fz="xs">
            <span className=" text-gray-500">Applied for: </span>
            {data?.BpService?.name}
          </Text>
        </Group>
        <Group justify="flex-end" align="start">
          <Flex className="flex-col items-center">
            <Button
              variant="outline"
              onClick={() => view(data)}
              disabled={data.status === 'Approved'}
            >
              view
            </Button>
          </Flex>
        </Group>
      </Flex>
    </Paper>
  );
};
