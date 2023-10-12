import React from 'react';
import { Flex } from '@mantine/core';
import { RegisterVendorRequestForm } from './_components/registerVendorRequest';
import { RequestAlertMessage } from './_components/requestAlertMessage';
export default function Page() {
  return (
    <Flex className="flex-wrap">
      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
        <RegisterVendorRequestForm />
      </Flex>
      <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center flex-col p-3">
        <RequestAlertMessage />
      </Flex>
    </Flex>
  );
}
