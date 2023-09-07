'use client';

import { Card, Divider, Group, Text } from '@mantine/core';
import { ReactElement } from 'react';
import styles from './page.module.scss';

type FeaturesCardProps = {
  color: string;
  title: string;
  description: string;
  icon: ReactElement;
};

export const FeaturesCard = (props: FeaturesCardProps) => {
  return (
    <Card withBorder w={300} p={0} h="100%" className={styles.featureCard}>
      <Card.Section>
        <Group p={30}>
          {props.icon}
          <Text fw="bold">{props.title}</Text>
        </Group>
      </Card.Section>
      <Divider size="xl" color={props.color} />
      <Card.Section p={30}>
        <Text size="sm">{props.description}</Text>
      </Card.Section>
    </Card>
  );
};
