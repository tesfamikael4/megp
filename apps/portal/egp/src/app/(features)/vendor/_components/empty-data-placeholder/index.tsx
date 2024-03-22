import { Button, Container, Flex, Text } from '@mantine/core';
import React from 'react';
import PlaceHolderIcon from './icon';

const EmptyDataPlaceholder = ({
  massage = 'No Data Found.',
}: {
  massage?: string;
}) => {
  return (
    <Container fluid>
      <Flex className=" justify-center items-center">
        <Flex className="flex-col justify-center items-center mt-6">
          <PlaceHolderIcon />
          <Text fz={12} c="#7D7D7DCC">
            {massage}
          </Text>
        </Flex>
      </Flex>
    </Container>
  );
};

export default EmptyDataPlaceholder;
