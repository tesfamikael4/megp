import { Flex, Text } from '@mantine/core';

export const CouplerPanel = (props: any) => {
  return (
    <Flex className="border p-4 rounded-lg font-semibold flex-col gap-2">
      <Text className="mb-4">{props.label}</Text>
      <Flex className=" justify-start gap-4">{props.children}</Flex>
    </Flex>
  );
};
