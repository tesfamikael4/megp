import React from 'react';
import styles from './info-cards.module.scss';
import { Box, Flex, SimpleGrid, Text } from '@mantine/core';
import { featuredContent } from './data';
import { FeaturesCard } from './card';

const InfoCards = () => {
  return (
    <Flex className={styles.root}>
      <Flex className={styles.titleContainer}>
        <Text fw={700} fz={'30px'}>
          Access Business Opportunities
        </Text>
        <Text fw={600} fz={'sm'} c={'gray.6'}>
          The eGP platform avails various online services and solutions to help
          you participate in government procurement.
        </Text>
      </Flex>
      <Flex className={styles.cardContainer}>
        <SimpleGrid
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
          cols={{ base: 1, sm: 2, md: 3 }}
          mb={'md'}
        >
          {featuredContent.map((item, index) => (
            <FeaturesCard
              key={index}
              icon={item.icon}
              color={item.color}
              title={item.title}
              description={item.description}
            />
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};

export default InfoCards;
