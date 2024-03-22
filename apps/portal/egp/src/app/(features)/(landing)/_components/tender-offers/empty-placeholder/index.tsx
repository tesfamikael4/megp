import { Box, Button, Center, Container, Flex, Text } from '@mantine/core';
import React from 'react';
import PlaceHolderIcon from './icon';

const EmptyPlaceholder = () => {
  return (
    <Container fluid mb={100}>
      <Flex className="flex-col gap-4 py-6 px-8 container mx-auto">
        <Text fw={600} fz={22} c={'primary.7'} ta={'center'}>
          Notice of Upcoming Tenders{' '}
        </Text>
        <Text fz={14} c="#37415199">
          MANEPS procurement notice pages help to ensure transparency, fairness,
          and efficiency in the procurement process, while also enabling
          interested parties to make informed decisions about whether to
          participate.Here you can find detailed information about opportunities
          for procurement that the organization is offering. We currently do not
          have any active tenders available for bidding. However, we are in the
          process of preparing and finalizing upcoming procurement opportunities
          that will be posted on this website in the near future. Please check
          back regularly for updates or subscribe to our notification service to
          receive alerts when new tenders are published. We appreciate your
          interest and look forward to your participation in our future
          procurement activities.
        </Text>
      </Flex>
      <Flex className=" justify-center items-center">
        <Flex className="flex-col justify-center items-center gap-3 mt-6">
          <PlaceHolderIcon />
          <Button variant="outline" size="md">
            Become a Vendor
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default EmptyPlaceholder;
