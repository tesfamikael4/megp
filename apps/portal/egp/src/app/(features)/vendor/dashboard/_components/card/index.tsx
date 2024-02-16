'use client';
import { Avatar, Box, Card, Flex, Group, Text } from '@mantine/core';
import { IconBriefcase, IconFileCheck, IconFolder } from '@tabler/icons-react';

export const infoCard = [
  {
    icon: (
      <Avatar color="#81D49A" variant="filled" radius={10}>
        <IconFolder size={32} stroke={1.5} className="text-white" />
      </Avatar>
    ),
    title: 'Draft Applications',
    count: 0,
    percent: 0,
  },
  {
    icon: (
      <Avatar
        styles={{
          placeholder: {
            background: '#F6C488',
          },
        }}
        variant="filled"
        radius={10}
      >
        <IconBriefcase size={32} stroke={1.5} className="text-white" />
      </Avatar>
    ),
    title: 'Registered Companies',
    count: 0,
    percent: 0,
  },
  {
    icon: (
      <Avatar
        styles={{
          placeholder: {
            background: '#9CBEFF',
          },
        }}
        variant="filled"
        radius={10}
      >
        <IconFileCheck size={32} stroke={1.5} className="text-white" />
      </Avatar>
    ),
    title: 'Follow up Task',
    count: 0,
    percent: 0,
  },
];

const InfoCard = ({ icon, title, count, percent }) => {
  return (
    <Card shadow={'1px'} p={24} radius="sm" className="bg-white border">
      <Flex className="justify-between">
        <Box>
          <Text c="dimmed" fs={'14'} fw={700}>
            {title}
          </Text>
          <Flex className="gap-x-2 mt-2" align="center">
            <Text className="font-extrabold" size="lg">
              {count}
            </Text>
            <Text className="text-emerald-500 font-extrabold" size="sm">
              +{percent}%
            </Text>
          </Flex>
        </Box>
        <Box color="white" w={50} h={50} mb={10} p={5}>
          {icon}
        </Box>
      </Flex>
    </Card>
  );
};

function DashboardCard() {
  return (
    <Group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
      {infoCard.map((card, index) => (
        <InfoCard
          key={index}
          icon={card.icon}
          title={card.title}
          count={card.count}
          percent={card.percent}
        />
      ))}
    </Group>
  );
}

export default DashboardCard;
