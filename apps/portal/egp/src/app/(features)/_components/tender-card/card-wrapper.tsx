import { Button, Flex, SimpleGrid, Text, rgba } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';

export const CardWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Flex direction={'column'} justify={'center'} pb={'md'} px={0}>
        <Flex
          className="items-center justify-between"
          // bg={rgba('var(--mantine-primary-color-3)', 0.1)}
        >
          <Text
            className=" pl-3 border-l-4 border-green-600 flex items-center font-semibold text-xl leading-6 tracking-tight "
            h={40}
          >
            {title}
          </Text>
          <Flex
            align="center"
            className="self-end px-0.5 cursor-pointer font-semibold p-2"
            gap={4}
            c="green"
          >
            <Text fw={500}>View All</Text>
            <IconArrowRight size={19} color="green" stroke={1} />
          </Flex>
        </Flex>
        <SimpleGrid mt={'md'} cols={{ base: 1, sm: 2, md: 2, lg: 2 }} p={10}>
          {children}
        </SimpleGrid>
      </Flex>
    </>
  );
};
