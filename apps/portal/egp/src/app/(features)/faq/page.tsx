import { Box, Container, Flex, SimpleGrid, Text } from '@mantine/core';
import React from 'react';
import { Vector } from './_componets/content';
import DataAccordion from './_componets/accordion';

const Page = () => {
  const accordionData = [
    {
      title: 'Where can I watch?',
      description:
        'Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis. ',
    },
    {
      title: 'Mauris id nibh eu fermentum mattis purus?',
      description: 'Content for print photos',
    },
    {
      title: 'Eros imperdiet rhoncus?',
      description: 'Content for camera settings',
    },
    {
      title: 'Varius vitae, convallis amet lacus sit aliquet nibh?',
      description: 'Content for camera settings',
    },
    {
      title: 'Tortor nisl pellentesque sit quis orci dolor?',
      description: 'Content for camera settings',
    },
    {
      title:
        'Vestibulum mauris mauris elementum proin amet auctor ipsum nibh sollicitudin?',
      description: 'Content for camera settings',
    },
  ];
  return (
    <Container fluid className="py-6  ">
      <SimpleGrid
        cols={{
          base: 1,
          md: 2,
        }}
      >
        <Flex className="justify-center sm:mt-10 md:mt-20">
          <Vector className="w-[160px] h-[160px] sm:h-[200px] sm:w-[200px] md:h-[300px] md:w-[300px]" />
        </Flex>
        <Box className="items-center justify-center  sm:mt-10 md:mt-12 ">
          <Text
            fz={{
              base: 16,
              sm: 32,
            }}
            fw={700}
            ta={{
              base: 'center',
              md: 'left',
            }}
            className="pl-4"
            mb={20}
          >
            Frequently Asked Questions
          </Text>
          <DataAccordion data={accordionData} />
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Page;
