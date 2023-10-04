'use client';

import {
  Container,
  Flex,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconBrandPlanetscale, IconChevronRight } from '@tabler/icons-react';
import { IconDraft, IconMyCompanies } from '../customIcon';
import styles from './infoCardsSection.module.scss';

export const featuresData = [
  {
    icon: IconDraft,
    title: 'Draft Applications',
    count: 0,
  },
  {
    icon: IconMyCompanies,
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
    <Paper h="100%" shadow="md" px="sm" py="sm" radius="md" w={'210px'}>
      <Flex direction={'column'}>
        <Flex align={'flex-start'} justify={'space-between'}>
          <ThemeIcon variant="light" size={60} radius={60}>
            <Icon size="2rem" stroke={1.5} />
          </ThemeIcon>
          <Text fw="600" size={'1.875rem'}>
            {count}
          </Text>
        </Flex>
        <Flex align={'center'} justify={'space-between'} mt={'1rem'}>
          <Text className={styles.title} size={'xs'} c="dimmed">
            {title}
          </Text>
          <IconChevronRight size="1rem" stroke={1.5} />
        </Flex>
      </Flex>
    </Paper>
  );
}

interface InfoCardsGridProps {
  data?: InfoCardProps[];
}

export function InfoCardsSection({ data = featuresData }: InfoCardsGridProps) {
  const features = data.map((feature, index) => (
    <InfoCard {...feature} key={index} />
  ));

  return (
    <Flex className="pb-40 items-center flex-col">
      <SimpleGrid
        mt={20}
        cols={{ base: 3, sm: 1, lg: 2 }}
        spacing={{ base: 7, sm: 7 }}
        verticalSpacing={{ base: 7, sm: 7 }}
        // breakpoints={[
        //   { maxWidth: 'md', cols: 2, spacing: 'xl' },
        //   { maxWidth: 'sm', cols: 1, spacing: 'xl' },
        // ]}
      >
        {features}
      </SimpleGrid>
    </Flex>
  );
}
