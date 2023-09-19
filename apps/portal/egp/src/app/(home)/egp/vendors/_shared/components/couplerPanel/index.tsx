import { Flex, Text } from '@mantine/core';

export const CouplerPanel = (props: any) => {
  return (
    <Flex
      gap={10}
      direction={'column'}
      className="border p-4 rounded-lg font-semibold"
    >
      <Text className="mb-4">{props.label}</Text>
      <Flex justify={'start'} gap={10}>
        {props.children}
      </Flex>
    </Flex>
  );
};
