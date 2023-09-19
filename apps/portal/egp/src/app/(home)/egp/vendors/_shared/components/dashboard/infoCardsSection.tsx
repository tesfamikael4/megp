'use client';

import {
  Container,
  Flex,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  createStyles,
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
    <Paper
      h="100%"
      shadow="md"
      px="sm"
      py="sm"
      radius="md"
      withBorder
      w={'210px'}
    >
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

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

interface InfoCardsGridProps {
  data?: InfoCardProps[];
}

export function InfoCardsSection({ data = featuresData }: InfoCardsGridProps) {
  const { classes } = useStyles();
  const features = data.map((feature, index) => (
    <InfoCard {...feature} key={index} />
  ));

  return (
    <Container className={classes.wrapper}>
      <SimpleGrid
        mt={20}
        cols={3}
        spacing="xl"
        breakpoints={[
          { maxWidth: 'md', cols: 2, spacing: 'xl' },
          { maxWidth: 'sm', cols: 1, spacing: 'xl' },
        ]}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}
