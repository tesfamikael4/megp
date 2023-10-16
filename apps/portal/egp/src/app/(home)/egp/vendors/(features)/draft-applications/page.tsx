'use client';
import React, { useEffect, useState } from 'react';
import { LoadingOverlay, Text } from '@mantine/core';
import { useGetFormQuery } from '@/store/api/vendor_registration/query';
import { Flex } from '@mantine/core';
import { IconBuilding, IconCalendar, IconFile } from '@tabler/icons-react';
import { NotificationService } from '../../_components/notification';
import { setCookie, hasCookie, getCookie } from 'cookies-next';
import Link from 'next/link';

const DraftApplication = () => {
  const vendorId = hasCookie('vendorId')
    ? (getCookie('vendorId') as string)
    : ' ';
  const requestInfo = useGetFormQuery(
    {
      vendorId,
    },
    { refetchOnMountOrArgChange: true },
  );

  // useEffect(() => {
  //   if (requestInfo.isError) {
  //     NotificationService.requestErrorNotification(
  //       'Error on fetching form data',
  //     );
  //   }

  //   return () => {};
  // }, [requestInfo.isError]);
  return (
    <Flex className="flex-col w-full h-full p-4">
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {requestInfo.isSuccess &&
      requestInfo.data &&
      requestInfo.data?.status == 'Save as Draft' ? (
        <Flex className="px-2 py-6 flex-col rounded-md  sm:px-8 border shadow-md border-gray-300  hover:shadow-lg hover:mb-1 relative">
          <Flex className="items-center justify-between mb-2">
            <Flex className="text-md font-semibold text-slate-500 gap-1 items-center">
              <IconBuilding size={'1rem'} />
              {requestInfo.data.basic.name}
            </Flex>
            <Flex>
              <Flex className="items-center text-sm text-slate-500 w-24 ">
                <IconCalendar size={'0.8rem'} /> 10/2/2023
              </Flex>
            </Flex>
          </Flex>

          <Flex className="items-center justify-between ml-3">
            <Flex className=" text-sm font-semibold w-full  flex-col">
              TN: {requestInfo.data?.id}
              <p className="text-xs leading-6 text-slate-600">
                {requestInfo.data.basic.tinNumber}
              </p>
            </Flex>
            <Link
              href={`new/${requestInfo.data.id}`}
              className='className="inline-flex justify-center rounded-lg text-sm font-semibold py-2 px-3 text-slate-900 ring-1 ring-slate-900/10 hover:ring-slate-900/20 hover:bg-slate-400"'
            >
              Continue
            </Link>
          </Flex>
        </Flex>
      ) : (
        <Flex className="w-full h-full justify-center mt-20">
          <Flex className="flex-col justify-center items-center">
            <IconFile size={'5rem'} stroke={'0.2'} />
            <Text>No data found</Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default DraftApplication;
