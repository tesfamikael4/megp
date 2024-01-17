import React from 'react';
import { AlertMessage } from '../_components/basic/alertMessageCard';
import { Flex } from '@mantine/core';
import BasicInformationPage from '../_components/basic/basicInformation-page';
import { useGetVendorQuery } from '../../_api/query';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';

function Page() {
  return (
    <Flex className="flex-wrap w-full">
      <Flex className="sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-1">
        <BasicInformationPage />
      </Flex>
      <Flex className="sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-1">
        <AlertMessage />
      </Flex>
    </Flex>
  );
}

export default Page;
