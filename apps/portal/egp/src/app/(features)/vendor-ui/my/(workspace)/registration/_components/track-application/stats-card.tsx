import { Text, Group, Badge, Paper, Flex, Button, Box } from '@mantine/core';
import style from './stats-card.module.scss';
import { ApplicationInfo } from '@/models/vendorRegistration';
import { IconEye } from '@tabler/icons-react';

interface Props {
  data: ApplicationInfo;
  view: (data: any) => void;
}
const badgeBGColor: { [key: string]: string } = {
  Rejected: `red.0`,
  Submitted: `blue.0`,
  Adjustment: `yellow.0`,
  Completed: `green.0`,
  Pending: `blue.0`,
  Outdated: `orange.0`,
};
const badgeTextColor: { [key: string]: string } = {
  Rejected: `red.6`,
  Submitted: `blue.6`,
  Adjustment: `yellow.6`,
  Completed: `green.6`,
  Pending: `blue.6`,
  Outdated: `orange.6`,
};
export const StatsListCard: React.FC<Props> = ({ data, view }) => {
  return (
    <Paper shadow="xs" withBorder className={style.card}>
      <Flex className="flex-col justify-between h-full">
        <Group justify="space-between" align="start">
          <Flex className="flex-col gap-3">
            <Badge
              size="xs"
              color={badgeBGColor[data.status]}
              className={'rounded-none flex items-center p-1.5'}
            >
              <Box c={badgeTextColor[data.status]}>{data.status}</Box>
            </Badge>
            <Text ta="left" fz="sm">
              <span className=" text-black font-semibold">
                Tracking Number:{' '}
              </span>
              <span className="text-[rgba(0, 0, 0, 0.6)]">
                {data.applicationNumber}
              </span>
            </Text>
          </Flex>

          <Text c="dimmed" ta="left" fz="xs">
            <span className="text-[rgba(0, 0, 0, 0.6)]">{data.approvedAt}</span>
          </Text>
        </Group>
        <Group justify="space-between" align="start">
          <Text ta="left" fz="xs">
            <span className=" text-black font-semibold">Category: </span>
            <span className="text-[rgba(0, 0, 0, 0.6)]">{data.category}</span>
          </Text>
        </Group>
        <Group justify="space-between" align="start">
          <Text ta="left" fz="xs">
            <span className=" text-black font-semibold">Applied for: </span>
            <span className="text-[rgba(0, 0, 0, 0.6)]">
              {data?.BpService?.name}
            </span>
          </Text>
        </Group>
        <Group justify="flex-end" align="start">
          <Button
            variant="outline"
            onClick={() => view(data)}
            disabled={data.status === 'Approved'}
          >
            View Detail
          </Button>
        </Group>
      </Flex>
    </Paper>
  );
};
