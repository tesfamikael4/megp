'use client';
import {
  Card,
  Center,
  Container,
  Flex,
  Group,
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

export const infoCard = [
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

function Dashboard() {
  const features = infoCard.map((card, index) => (
    <Flex key={index} className="flex-col border rounded p-4">
      <Center className="justify-between">
        <ThemeIcon variant="light">
          <card.icon size="2rem" stroke={1.5} />
        </ThemeIcon>
        <Text>{card.count}</Text>
      </Center>
      <Center className="justify-between mt-2 gap-7">
        <Text c="dimmed">{card.title}</Text>
        <IconChevronRight size="1rem" stroke={1.5} />
      </Center>
    </Flex>
  ));

  return (
    <Group gap={10} p={20}>
      {features}
    </Group>
  );
}
export default Dashboard;
