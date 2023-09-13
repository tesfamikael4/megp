'use client';

import { Box, Center, Flex, Text } from '@mantine/core';
import styles from './landing.module.scss';

type HighLightCardProps = {
  type: 'grid' | 'list';
  data: any[];
};

export const HighLightCard = (props: HighLightCardProps) => {
  return (
    <Box className="w-full rounded-3xl shadow-lg">
      <Flex>
        <Box
          className={
            styles.highlightCard + ` rounded-tl-3xl z-10 border-b  border-r`
          }
        >
          <Flex>
            <Center>{props.data[0].icon}</Center>
            <Box ml={10}>
              <Text fw="bold" size="xl">
                {props.data[0].title}
              </Text>
              <Text size="xs">{props.data[0].subTitle}</Text>
            </Box>
          </Flex>
        </Box>
        <Box
          className={styles.highlightCard + ` rounded-tr-3xl z-10 border-b `}
        >
          <Flex>
            <Center>{props.data[1].icon}</Center>
            <Box ml={10}>
              <Text fw="bold" size="xl">
                {props.data[1].title}
              </Text>
              <Text size="xs">{props.data[1].subTitle}</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Flex>
        <Box className={styles.highlightCard + ` rounded-bl-3xl border-r`}>
          <Flex>
            <Center>{props.data[2].icon}</Center>
            <Box ml={10}>
              <Text fw="bold" size="xl">
                {props.data[2].title}
              </Text>
              <Text size="xs">{props.data[2].subTitle}</Text>
            </Box>
          </Flex>
        </Box>
        <Box className={styles.highlightCard + ` rounded-br-3xl p-4`}>
          <Flex>
            <Center>{props.data[3].icon}</Center>
            <Box ml={10}>
              <Text fw="bold" size="xl">
                {props.data[3].title}
              </Text>
              <Text size="xs">{props.data[3].subTitle}</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
