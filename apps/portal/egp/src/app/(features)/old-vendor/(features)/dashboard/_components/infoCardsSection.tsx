'use client';

import {
  Card,
  Container,
  Flex,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconBrandPlanetscale,
  IconBuilding,
  IconChevronRight,
  IconFolderFilled,
} from '@tabler/icons-react';
import styles from './infoCardsSection.module.scss';

export const featuresData = [
  {
    icon: IconFolderFilled,
    title: 'Draft Applications',
    count: 0,
  },
  {
    icon: IconBuilding,
    title: 'Registered Companies',
    count: 0,
  },
  {
    icon: IconBrandPlanetscale,
    title: 'Follow up Task',
    count: 0,
  },
];

interface InfoCardProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  count: number;
}
export function InfoCard({ icon: Icon, title, count }: InfoCardProps) {
  return (
    <Flex className="flex-col border rounded p-4">
      <Flex className="items-start justify-between">
        <ThemeIcon variant="light">
          <Icon size="2rem" stroke={1.5} />
        </ThemeIcon>
        <Text>{count}</Text>
      </Flex>
      <Flex className="items-center justify-between mt-2 gap-7">
        <Text c="dimmed">{title}</Text>
        <IconChevronRight size="1rem" stroke={1.5} />
      </Flex>
    </Flex>
  );
}

interface InfoCardsGridProps {
  data?: InfoCardProps[];
}

export function InfoCardsSection({ data = featuresData }: InfoCardsGridProps) {
  const features = data.map((feature, index) => (
    <InfoCard {...feature} key={index} />
  ));

  return <Flex className="items-center gap-7 p-4">{features}</Flex>;
}
