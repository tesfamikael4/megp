'use client';
import React, { useState } from 'react';
import { ActionIcon, Box, LoadingOverlay, Paper, Text } from '@mantine/core';
import Link from 'next/link';
import {
  useGetApplicationStatusByUserIdQuery,
  useLazyDeleteApplicationByVendorIdQuery,
} from '@/store/api/vendor_registration/query';
import { generateAndSaveKey } from '../_shared/lib/objectParser/object';
import { Flex } from '@mantine/core';
import { IconBuilding, IconCalendar, IconTrash } from '@tabler/icons-react';
import { IconEmptyData } from '../_shared/components/customIcon';
import { notifications } from '@mantine/notifications';

const DraftApplication = () => {
  const {
    data: applicationData,
    isLoading: isApplicationDataLoading,
    isSuccess: isApplicationDataSuccess,
    isError: isApplicationDataError,
    status: applicationDataStatus,
  } = useGetApplicationStatusByUserIdQuery({
    userId: generateAndSaveKey() as string,
  });
  const [
    triggerDelete,
    {
      isLoading: isApplicationDataDeleteLoading,
      isSuccess: isApplicationDataDeleteSuccess,
      isError: isApplicationDataDeleteError,
      status: applicationDataDeleteStatus,
    },
  ] = useLazyDeleteApplicationByVendorIdQuery();
  isApplicationDataDeleteError &&
    notifications.show({
      title: 'Notification Error',
      message: 'Error!',
    });
  applicationDataDeleteStatus === 'fulfilled' &&
    notifications.show({
      title: 'Notification',
      message: 'Deleted successfully!',
    });

  return (
    <Flex className="flex-col w-full h-full p-4">
      <LoadingOverlay
        visible={isApplicationDataLoading || isApplicationDataDeleteLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {applicationDataStatus == 'fulfilled' &&
      applicationData &&
      applicationData?.status == 'Submitted' ? (
        <Flex className="px-2 py-6 flex-col rounded-md  sm:px-8 border shadow-md border-gray-300  hover:shadow-lg hover:mb-1 relative">
          <Flex className="items-center justify-between mb-2">
            <Flex className="text-md font-semibold text-slate-500 gap-1 items-center">
              <IconBuilding size={'1rem'} />
              {applicationData.name}
            </Flex>
            <Flex>
              <Flex className="items-center text-sm text-slate-500 w-24 ">
                <IconCalendar size={'0.8rem'} /> 10/2/2023
              </Flex>
            </Flex>
          </Flex>

          <Flex className="items-center justify-between ml-3">
            <Flex className=" text-sm font-semibold w-full  flex-col">
              TN: {applicationData.id}
              <p className="text-xs leading-6 text-slate-600">
                {applicationData.tin}
              </p>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex className="w-full h-full justify-center mt-20">
          <Flex className="flex-col">
            <IconEmptyData />
            <Text>No Data</Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default DraftApplication;
