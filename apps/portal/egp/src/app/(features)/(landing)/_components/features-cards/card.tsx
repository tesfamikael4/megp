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
import { ReactElement } from 'react';
import styles from './info-cards.module.scss';
import { IconArrowRight } from '@tabler/icons-react';

type FeaturesCardProps = {
  color: string;
  title: string;
  description: string;
  icon: ReactElement;
};

export const FeaturesCard = (props: FeaturesCardProps) => {
  return (
    <Card className={`${styles.card} cursor-pointer w-full`} shadow="xs">
      <Group gap={6}>
        <ThemeIcon
          color={props.color}
          variant="transparent"
          radius="md"
          size={26}
        >
          {props.icon}
        </ThemeIcon>
        <Text fw={500} fz={18}>
          {props.title}
        </Text>
      </Group>
      <Divider size={'sm'} className="my-4" color={props.color} />
      <Text fz={12}>{props.description}</Text>
      <Flex className="py-4 justify-end  items-center">
        <IconArrowRight className={styles.arrow} size={18} />
      </Flex>
    </Card>
  );
};
