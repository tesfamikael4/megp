import { Box, Flex, Text } from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';

export const TargetGroupCard = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <Box className="border rounded p-2 w-full cursor-pointer">
      <Flex align="center" gap={10}>
        <IconUserCircle
          color={parseFloat(value) >= 50 ? 'green' : 'orange'}
          size={35}
        />
        <Box>
          <Text className="text-xs text-slate-500">{label}</Text>
          <Text className="font-semibold text-lg">{value}%</Text>
        </Box>
      </Flex>
    </Box>
  );
};
