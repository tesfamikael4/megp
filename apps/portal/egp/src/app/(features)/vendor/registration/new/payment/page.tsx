'use client';
import { Flex, Button, LoadingOverlay } from '@mantine/core';
import React, { useEffect } from 'react';
import InvoiceTemplate from '../../../_components/dynamicPrintComponent/invoice';
import { getCookie } from 'cookies-next';
import { useAddFormMutation, useGetFormQuery } from '../_api/query';
import { NotificationService } from '../../../_components/notification';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();
  const vendorId = getCookie('vendorId') || ' ';
  const requestInfo = useGetFormQuery({
    vendorId,
  });
  const [save, saveValues] = useAddFormMutation();
  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }

    return () => {};
  }, [requestInfo, router]);

  useEffect(() => {
    if (saveValues.isSuccess) {
      NotificationService.successNotification('Payed Successfully!');
      router.push(`doc`);
    }
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [saveValues.isSuccess, saveValues.isError, router]);
  const onSave = () => {
    save({
      data: {
        ...requestInfo.data,
        level: 'doc',
      },
    });
  };
  return (
    <Flex className="flex-col w-full relative items-center justify-center">
      <Flex className=" flex-col gap-2">
        <LoadingOverlay
          visible={saveValues.isLoading || requestInfo.isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />

        {requestInfo.data && (
          <Flex className="w-[600px]">
            <InvoiceTemplate
              invoiceData={requestInfo.data?.invoice[0]}
              sizeType="lg"
            />
          </Flex>
        )}
        <Flex justify="end" className="gap-2 mt-4">
          <Button onClick={() => onSave()}>Pay</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Page;
