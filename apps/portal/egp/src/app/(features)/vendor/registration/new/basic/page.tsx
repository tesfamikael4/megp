import React from 'react';
import { BasicInformation } from '../_components/basic/basicInformation';
import { AlertMessage } from '../_components/basic/alertMessageCard';
import { Flex } from '@mantine/core';

function Page() {
  return (
    <Flex className="flex-wrap w-full">
      <Flex className="sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-1">
        <BasicInformation />
      </Flex>
      <Flex className="sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-1">
        <AlertMessage />
      </Flex>
    </Flex>
  );
}

export default Page;
