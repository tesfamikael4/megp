'use client';
import {
  Flex,
  Button,
  LoadingOverlay,
  Stack,
  TextInput,
  Center,
} from '@mantine/core';
import React, { useEffect } from 'react';
import InvoiceTemplate from '../../../_components/dynamicPrintComponent/invoice-sm';
import { getCookie } from 'cookies-next';
import { useAddFormMutation, useGetFormQuery } from '../_api/query';
import { NotificationService } from '../../../_components/notification';
import { useRouter } from 'next/navigation';
import PaymentMethod from '../_components/payment/payment-method';
import UppyAttachmentDashboard from '../../../_components/UppyAttachmentDashboard/UppyAttachmentDashboard';

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
      //  router.push(`basic`);
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
      <Flex className="gap-2 w-full">
        <LoadingOverlay
          visible={saveValues.isLoading || requestInfo.isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <Flex className="flex-col border p-4 shadow-md h-fit max-w-3xl w-full">
          <Center>
            <PaymentMethod />
          </Center>

          <Stack className="mt-10">
            <TextInput label="Transaction Number" />

            <UppyAttachmentDashboard
              tusServerUrl="http://localhost:3000/api/upload/files/"
              id="paymentSlip"
              label="Payment Slip"
              placeholder="Upload"
            />
          </Stack>
          <Flex justify="end" className="gap-2 mt-4">
            <Button onClick={() => onSave()}>Pay</Button>
          </Flex>
        </Flex>
        {requestInfo.data && (
          <Flex className="max-w-2xl flex-col border shadow-md w-full">
            <InvoiceTemplate invoiceData={requestInfo.data?.invoice[0]} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default Page;
