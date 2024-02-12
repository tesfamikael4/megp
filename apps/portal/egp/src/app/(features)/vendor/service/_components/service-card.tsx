'use client';

import { Card, Divider, Flex, Group, Text } from '@mantine/core';
import { ReactElement } from 'react';
import styles from './landing.module.scss';
import { IconArrowRight, IconEdit, IconPencil } from '@tabler/icons-react';
import { IconEyeEdit } from '@tabler/icons-react';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';

type FeaturesCardProps = {
  color?: string;
  title: string;
  description: string;
  icon?: ReactElement;
  link: string;
};

export const ServiceCard = (props: FeaturesCardProps) => {
  const router = useRouter();
  const [showArrow, { open, close }] = useDisclosure(false);
  return (
    <Card
      withBorder
      h={150}
      className={styles.featureCard}
      onClick={() => router.push(props.link)}
      styles={{
        section: {
          padding: 24,
        },
      }}
      onMouseEnter={() => open()}
      onMouseLeave={() => close()}
    >
      <Flex className="gap-4">
        <span className="w-4 h-4">
          <IconPencil size={20} stroke={1.5} color="green" />
        </span>
        <Flex direction={'column'} gap={16}>
          <Text
            className="text-lg font-[500]"
            style={{
              fontSize: '20px',
              lineHeight: '14px',
            }}
          >
            {props.title}
          </Text>

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
        </Flex>
      </Flex>
      {showArrow && (
        <IconArrowRight
          className="absolute bottom-1 right-2"
          size={25}
          stroke={1.5}
        />
      )}
    </Card>
  );
};
