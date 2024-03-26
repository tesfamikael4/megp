'use client';
import {
  Box,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Text,
  Card,
  Avatar,
  Menu,
  Group,
  Container,
} from '@mantine/core';

export const InfoCard = ({
  icon,
  title,
  count,
  percent,
}: {
  icon: any;
  title: string;
  count: number;
  percent?: number | string;
}) => {
  return (
    <Card shadow={'xs'} p={24} radius="md" className="bg-white">
      <Flex className="justify-between">
        <Box>
          <Text c="#A0AEC0" fs={'14'} fw={700}>
            {title}
          </Text>
          <Flex className="gap-x-2 mt-2" align="center">
            <Text className="font-extrabold" size="lg">
              {count}
            </Text>
            <Text fw={600} c="primary.7">
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

function DashboardCard({ infoCard }) {
  return (
    <Group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
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
