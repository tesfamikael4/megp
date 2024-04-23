'use client';
import { Container, Flex, List, SimpleGrid, Text } from '@mantine/core';
import React from 'react';
import InfoCard from './_components/info-card';
import { IconCreditCard, IconMail, IconUser } from '@tabler/icons-react';

const iconProps = {
  size: 18,
  stroke: 1.8,
  color: '#1D8E3F',
};
const Page = () => {
  const CardData = [
    {
      title: 'Mission',
      description:
        'To provide a regulatory, monitoring, and oversight service on public procurement and asset disposal matters in a professional, efficient, and effective manner, with the aim of achieving value for money.',
      icon: IconMail,
    },
    {
      title: 'Vision',
      description:
        'Procurement and Asset Disposal System that is characterized by transparency, fairness, efficiency, and freedom from corruption to instill public confidence and ensure that the procurement and disposal of assets are conducted in a manner that is beyond reproach.',
      icon: IconCreditCard,
    },
    {
      title: 'Values',
      description: (
        <List listStyleType="disc" fz={12} c="#53686A">
          <List.Item>Transparency and accountability</List.Item>
          <List.Item>Integrity</List.Item>
          <List.Item>Teamwork</List.Item>
          <List.Item>Effective</List.Item>
          <List.Item>Secure</List.Item>
        </List>
      ),
      icon: IconUser,
    },
    {
      title: 'Lorem ipsum dolor sit , consectetur adipiscing',
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      icon: IconUser,
    },
    {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      icon: IconUser,
    },
    {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      icon: IconUser,
    },
    {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      icon: IconUser,
    },
  ];
  return (
    <Container className="mx-auto" fluid>
      <Flex className="items-center justify-center py-6 sm:pb-10">
        <Flex className="flex-col items-center justify-center">
          <Text
            c="primary.7"
            fw={600}
            fz={{
              base: 18,
              sm: 29,
            }}
            ta={'center'}
          >
            About MANEPS
          </Text>
          <Text
            c="#7D7D7D"
            fz={{
              base: 14,
              sm: 16,
            }}
            ta={'center'}
          >
            Malawi National Electronic Procurement System
          </Text>
        </Flex>
      </Flex>
      <SimpleGrid
        cols={{
          base: 1,
          sm: 2,
          md: 2,
          lg: 4,
        }}
      >
        {CardData.map((card, index) => (
          <InfoCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            iconProps={iconProps}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Page;
