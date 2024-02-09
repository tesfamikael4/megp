import React from 'react';
import { ServiceCard } from './_components/service-card';
import { Box, Container, Flex, SimpleGrid } from '@mantine/core';
import { Section } from '@megp/core-fe';

const services: { title: string; link: string; description: string }[] = [
  {
    title: 'Get registration',
    link: '/vendor/registration/new/basic',
    description:
      'New Professional Licensing Service is provided: - for those who have graduated from an accredited educational institution and/or for the expert of experience who has Certification of Occupational Competency (COC), to register as a new professional, one must have received no professional licenses form this Authority before. New professional licensing registration services will be provided by design or construction as appropriate. Design professional licenses are issued, for professionals who are employed in the consulting sector, for professionals who are organized or run a consulting firm; in other hand, construction professional licenses are issued for professionals who are employed in the construction sector, for professionals who are organized or run a construction firm.',
  },
  {
    title: 'Renew registration',
    link: '/vendor/registration/renewal/ppda',
    description: 'Renew registration for existing business',
  },
  {
    title: 'Upgrade registration',
    link: '/vendor/registration/upgrade/business-areas',
    description: 'Upgrade registration for existing business',
  },
  {
    title: 'Profile update',
    link: '/vendor/registration/profile-update',
    description: 'Profile update for existing business',
  },
  {
    title: 'Preferential Treatment',
    link: '/vendor/registration/preferential-treatment',
    description: 'Preferential Treatment for existing business',
  },
  {
    title: 'Cancel registration',
    link: '/vendor/registration/cancel',
    description: 'Cancel registration for existing business',
  },
  {
    title: 'Track Application',
    link: '/vendor/registration/track-applications',
    description: 'Track application for existing business',
  },
  {
    title: 'My Briefcase',
    link: '/vendor/registration/my-briefcase',
    description: 'My Briefcase for existing business',
  },
];

const ServiceLayout = () => {
  return (
    <Box mih={'80%'} m={24}>
      <Section
        title="Vendor Services"
        collapsible={false}
        className="w-full h-full"
      >
        <SimpleGrid
          cols={{ base: 1, xs: 2, md: 3, lg: 2, xl: 3 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', xl: 'xl' }}
        // className="p-10"
        >
          {services.map((service, index) => {
            return <ServiceCard key={index} {...service} />;
          })}
        </SimpleGrid>
      </Section>
    </Box>
  );
};

export default ServiceLayout;
