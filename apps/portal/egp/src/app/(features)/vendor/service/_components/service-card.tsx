'use client';

import { Card, Divider, Group, Text } from '@mantine/core';
import { ReactElement } from 'react';
import styles from './landing.module.scss';
import { IconEdit, IconPencil } from '@tabler/icons-react';
import { IconEyeEdit } from '@tabler/icons-react';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

type FeaturesCardProps = {
  color?: string;
  title: string;
  description: string;
  icon?: ReactElement;
  link: string;
};

export const ServiceCard = (props: FeaturesCardProps) => {
  const router = useRouter();
  return (
    <Card
      withBorder
      w={450}
      h={150}
      className={styles.featureCard}
      onClick={() => router.push(props.link)}
      styles={{
        section: {
          padding: 20,
        },
      }}
    >
      <Card.Section className="border-b">
        <Group>
          {props.icon ?? <IconPencil size={20} stroke={1.5} color="green" />}
          <Text
            className="text-lg font-bold"
            style={{
              fontSize: '20px',
              lineHeight: '14px',
            }}
          >
            {props.title}
          </Text>
        </Group>
      </Card.Section>
      {/* <Divider /> */}
      <Card.Section py={10}>
        <Text
          size="md"
          lineClamp={3}
          style={{
            fontSize: '14px',
            lineHeight: '20px',
          }}
        >
          {props.description}
        </Text>
      </Card.Section>
    </Card>
  );
};
