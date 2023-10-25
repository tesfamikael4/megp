import React from 'react';
import { Flex } from '@mantine/core';
import { RequestForm } from './_components/requestForm';
import { AlertMessageCard } from './_components/alertMessageCard';
export default function Page() {
  return (
    <Flex className="flex-wrap">
      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <RequestForm />
      </Flex>
      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center flex-col p-3">
        <AlertMessageCard />
      </Flex>
    </Flex>
  );
}
