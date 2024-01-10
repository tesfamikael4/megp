import { Avatar, Box, Flex, Text } from '@mantine/core';
import {
  IconAntennaBars4,
  IconPennantFilled,
  IconUserCircle,
} from '@tabler/icons-react';

export const StatisticCard = ({
  title,
  value,
  minValue = 0,
  type,
}: {
  title: string;
  value: number | string;
  minValue?: number;
  type: 'targetGroup' | 'activity' | 'status';
}) => {
  return (
    <Box className="p-2 border-r border-b w-1/3 cursor-pointer hover:shadow-lg">
      <Flex align="center" gap="sm">
        <Avatar radius="xl" color="gray">
          {type === 'targetGroup' && (
            <IconUserCircle
              color={(value as number) >= minValue ? 'green' : 'orange'}
            />
          )}
          {type === 'activity' && (
            <IconAntennaBars4 size={30} className="text-primary" />
          )}
          {type === 'status' && <IconPennantFilled className="text-primary" />}
        </Avatar>
        <Box>
          <Text className="text-slate-500 text-xs">{title}</Text>
          <Text className="font-semibold">
            {value}
            {type === 'targetGroup' ? '%' : ''}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
