import React from 'react';
import { ServiceCard } from './_components/service-card';
import { Flex, SimpleGrid } from '@mantine/core';

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
    title: 'IBM',
    link: '/vendor/registration/preferential-treatment/ibm',
    description: 'IBM registration for existing business',
  },
  {
    title: 'MSME',
    link: '/vendor/registration/preferential-treatment/msme',
    description: 'MSME registration for existing business',
  },
];

const ServiceLayout = () => {
  return (
    <Flex justify="center" className="w-full h-full p-6">
      <Flex className="w-full flex-col border border-l-0 bg-white">
        <Flex className="w-full border-b p-3 flex justify-between">
          Page Title
        </Flex>
        <SimpleGrid
          cols={{ base: 1, xs: 2, md: 3, lg: 2, xl: 3 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', xl: 'xl' }}
          className="p-6"
          mah={'60%'}
        >
          {services.map((service, index) => {
            return <ServiceCard key={index} {...service} />;
          })}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};

export default ServiceLayout;
