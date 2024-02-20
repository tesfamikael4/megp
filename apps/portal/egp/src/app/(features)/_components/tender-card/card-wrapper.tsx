import { Button, Flex, SimpleGrid, Text } from '@mantine/core';
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
        <Flex align="center" justify={'space-between'}>
          <Text
            className=" pl-3 border-l-4 border-green-300 flex items-center font-semibold text-xl leading-6 tracking-tight "
            h={40}
          >
            {title}
          </Text>
          <Button
            variant="subtle"
            rightSection={
              <IconArrowRight size={18} color="green" stroke={1.6} />
            }
            className="self-end"
          >
            View All
          </Button>
        </Flex>
        <SimpleGrid mt={'md'} cols={{ base: 1, sm: 2, md: 2, lg: 2 }}>
          {children}
        </SimpleGrid>
      </Flex>
    </>
  );
};
