'use client';

import {
  Box,
  Card,
  Divider,
  Flex,
  Group,
  Text,
  ThemeIcon,
  rem,
} from '@mantine/core';
import { ReactElement, useState } from 'react';
import styles from './landing.module.scss';
import { IconArrowRight } from '@tabler/icons-react';

type FeaturesCardProps = {
  color: string;
  title: string;
  description: string;
  icon: ReactElement;
};

export const FeaturesCard = (props: FeaturesCardProps) => {
  const [showArrow, setShowArrow] = useState(false);
  return (
    <Box
      style={{ position: 'relative' }}
      className="cursor-pointer w-full"
      onMouseEnter={() => setShowArrow(true)}
      onMouseLeave={() => setShowArrow(false)}
      bg={'#F5FBFE'}
      px={rem(24)}
      py={rem(20)}
    >
      <Flex
        columnGap={rem(10)}
        align="center"
        justify={'space-between'}
        className={styles.card}
      >
        <Group>
          <ThemeIcon color={props.color} variant="light" radius="md" size="lg">
            {props.icon}
          </ThemeIcon>
          <Text className={`line-clamp-1 md:line-clamp-none`}>
            {props.title}
          </Text>
        </Group>
        {showArrow && <IconArrowRight size={30} color={props.color} />}
      </Flex>
      <Divider size={'md'} className="my-4" color={props.color} />
      <Text size="sm" className="line-clamp-2">
        {props.description}
      </Text>
    </Box>
  );
};
