'use client';

import { Box, Center, Flex, Text } from '@mantine/core';
import styles from './landing.module.scss';

type HighLightCardProps = {
  type: 'grid' | 'list';
  data: any[];
};

export const HighLightCard = (props: HighLightCardProps) => {
  return props.type == 'grid' ? (
    <Box className="w-full rounded-3xl shadow-lg ">
      <Flex className="h-1/2">
        <Box
          className={
            styles.highlightCard + ` rounded-tl-3xl z-10 border-b  border-r`
          }
        >
          <Flex align="center" className="h-full">
            <Center>{props.data[0].icon}</Center>
            <Box ml={10}>
              <Text fw="bold" size="xl">
                {props.data[0].title}
              </Text>
              <Text size="xs" fw="500">
                {props.data[0].subTitle}
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box
          className={styles.highlightCard + ` rounded-tr-3xl z-10 border-b `}
        >
          <Flex align="center" className="h-full">
            <Center>{props.data[1].icon}</Center>
            <Box ml={10}>
              <Text fw="bold" size="xl">
                {props.data[1].title}
              </Text>
              <Text size="xs" fw="500">
                {props.data[1].subTitle}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Flex className="h-1/2">
        <Box className={styles.highlightCard + ` rounded-bl-3xl border-r`}>
          <Flex align="center" className="h-full">
            <Center>{props.data[2].icon}</Center>
            <Box ml={10}>
              <Text fw="bold" size="xl">
                {props.data[2].title}
              </Text>
              <Text size="xs" fw="500">
                {props.data[2].subTitle}
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box className={styles.highlightCard + ` rounded-br-3xl p-4`}>
          <Flex align="center" className="h-full">
            <Center>{props.data[3].icon}</Center>
            <Box ml={10}>
              <Text fw="bold" size="xl">
                {props.data[3].title}
              </Text>
              <Text size="xs" fw="500">
                {props.data[3].subTitle}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  ) : (
    <Box className={styles.highlightListCard}>
      <Box className={`${styles.highlightList} rounded-t-3xl`}>
        <Box className={styles.highlightListFlex}>
          {props.data[0].icon}
          <Box ml={10}>
            <Text fw="bold" size="xl">
              {props.data[0].title}
            </Text>
            <Text size="xs" fw="500">
              {props.data[0].subTitle}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box className={styles.highlightList}>
        <Box className={styles.highlightListFlex}>
          {props.data[1].icon}
          <Box ml={10}>
            <Text fw="bold" size="xl">
              {props.data[1].title}
            </Text>
            <Text size="xs" fw="500">
              {props.data[1].subTitle}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box className={`${styles.highlightList} rounded-b-3xl`}>
        <Box className={styles.highlightListFlex}>
          {props.data[2].icon}
          <Box ml={10}>
            <Text fw="bold" size="xl">
              {props.data[2].title}
            </Text>
            <Text size="xs" fw="500">
              {props.data[2].subTitle}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
