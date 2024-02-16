'use client';

import { FeaturesCard } from './_components/features-card';
import { Box, Container, Flex, SimpleGrid } from '@mantine/core';
import styles from './page.module.scss';
import { HeroSection } from './_components/hero/hero-section';
import { StepsSection } from './_components/steps/steps-section';
import TenderCard from './_components/tender-card';
import { useAuth } from '@megp/auth';
import { CardWrapper } from './_components/tender-card/card-wrapper';
import { featuredContent } from './_constants';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Box bg={'#F5FBFE'}>
      <HeroSection />
      {!isAuthenticated && (
        <Flex direction={'column'} justify={'center'} my={40}>
          <Container size={'xl'}>
            <p className={styles.featureTitle}>
              Access Business Opportunities{' '}
            </p>
            <p className={styles.featureSubtitle}>
              The eGP platform avails various online services and solutions to
              help you participate in government procurement.
            </p>
            <SimpleGrid
              mt={60}
              cols={{ base: 1, sm: 2, md: 3 }}
              spacing={{ base: 'xl', md: 60 }}
              verticalSpacing={{ base: 'xl', md: 50 }}
              className="mb-3"
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
          </Container>
        </Flex>
      )}
      {!isAuthenticated && <StepsSection />}
      <Box pt={60} className="container mx-auto">
        <CardWrapper title="Latest Tenders">
          {Array.from({ length: 4 }).map((_, index) => (
            <TenderCard key={index} color={'orange'} />
          ))}
        </CardWrapper>
        <CardWrapper title="Last Offers">
          {Array.from({ length: 4 }).map((_, index) => (
            <TenderCard key={index} color={'#F0FFF3'} textColor={'black'} />
          ))}
        </CardWrapper>
        <CardWrapper title="Least Biders">
          {Array.from({ length: 4 }).map((_, index) => (
            <TenderCard key={index} color={'red'} register />
          ))}
        </CardWrapper>
      </Box>
    </Box>
  );
}
