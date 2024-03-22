'use client';

import { Box, Container, Flex, SimpleGrid } from '@mantine/core';
import { HeroSection } from './_components/hero/hero-section';
import { StepsSection } from './_components/steps/steps-section';
import { useAuth } from '@megp/auth';

import InfoCards from './_components/features-cards';
import Footer from './_components/footer';
import TenderOffers from './_components/tender-offers';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Container fluid p={0}>
      <HeroSection />
      <InfoCards />
      <StepsSection />
      <TenderOffers />
      <Footer />
    </Container>
  );
}
