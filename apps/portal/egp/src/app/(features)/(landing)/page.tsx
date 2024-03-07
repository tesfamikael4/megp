'use client';

import { Box, Container, Flex, SimpleGrid } from '@mantine/core';
import { HeroSection } from './_components/hero/hero-section';
import { StepsSection } from './_components/steps/steps-section';
import { useAuth } from '@megp/auth';
import TenderCard from '../_components/tender-card';
import { CardWrapper } from '../_components/tender-card/card-wrapper';
import InfoCards from './_components/features-cards';
import Footer from './_components/footer';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Container fluid p={0}>
      <HeroSection />
      <InfoCards />
      <StepsSection />
      <Container size={'xl'} pt={60} px={'xs'}>
        <Flex className="flex-col gap-10">
          <CardWrapper title="Latest Tenders">
            {Array.from({ length: 4 }).map((_, index) => (
              <TenderCard key={index} color={'orange'} textColor={'white'} />
            ))}
          </CardWrapper>
          <CardWrapper title="Last Offers">
            {Array.from({ length: 4 }).map((_, index) => (
              <TenderCard key={index} color={'yellow'} textColor={'white'} />
            ))}
          </CardWrapper>
          <CardWrapper title="Least Biders">
            {Array.from({ length: 4 }).map((_, index) => (
              <TenderCard
                key={index}
                color={'red'}
                register
                textColor={'white'}
              />
            ))}
          </CardWrapper>
        </Flex>
      </Container>
      <Footer />
    </Container>
  );
}
